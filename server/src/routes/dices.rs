use crate::handlers::dices;
use crate::utils;
use warp::Filter;

pub fn routes(
    db: impl utils::DBConnection,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    roll(db.clone()).or(dice(db))
}

// GET /:id
fn dice(
    db: impl utils::DBConnection,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::get()
        .and(warp::path::param())
        .and(with_db(db))
        .and_then(dices::find_dice)
        .with(warp::trace::named("DICE"))
}

// POST /roll
fn roll(
    db: impl utils::DBConnection,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path("roll")
        .and(warp::post())
        .and(with_db(db))
        .and(utils::with_validated_json())
        .and_then(dices::roll_dice)
        .with(warp::trace::named("ROLL"))
}

fn with_db(
    db: impl utils::DBConnection,
) -> impl Filter<Extract = (impl utils::DBConnection,), Error = std::convert::Infallible> + Clone {
    warp::any().map(move || db.clone())
}

#[cfg(test)]
mod tests {
    use super::routes;
    use super::utils;
    use crate::models::dice::{Dice, DiceType};
    use async_trait::async_trait;
    use warp::http::StatusCode;
    use warp::test::request;

    #[derive(Clone)]
    pub struct Mock {}

    #[async_trait]
    impl utils::DBConnection for Mock {
        async fn get_dice(&self, _id: String) -> utils::Result<Dice> {
            Ok(dice())
        }

        async fn set_dice(&self, _dice: &Dice) {}
    }

    #[tokio::test]
    async fn test_dice() {
        let redis = Mock{};
        let api = routes(redis);
        let resp = request().method("GET").path("/id").reply(&api).await;

        assert_eq!(resp.status(), StatusCode::OK);
    }

    #[tokio::test]
    async fn test_roll() {
        let redis = Mock{};
        let api = routes(redis);
        let resp = request()
            .method("POST")
            .path("/roll")
            .json(&roll_request())
            .reply(&api)
            .await;

        assert_eq!(resp.status(), StatusCode::OK);
    }

    fn dice() -> Dice {
        Dice {
            id: "id".to_string(),
            dice_type: DiceType::D6,
            number: 4,
        }
    }

    fn roll_request() -> utils::Request {
        utils::Request {
            dice_type: Some(DiceType::D20),
        }
    }
}
