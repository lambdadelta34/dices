use crate::handlers::dices;
use crate::models::dice;
use crate::utils;
use serde::{Deserialize, Serialize};
use validator::Validate;
use warp::Filter;

pub fn routes(
    redis: redis::Client,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    roll(redis.clone()).or(dice(redis.clone()))
}

// GET /:id
fn dice(
    redis: redis::Client,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::get()
        .and(warp::path::param())
        .and(with_db(redis))
        .and_then(|id: String, db: redis::Client| async move {
            match dices::find_dice(db, id).await {
                Ok(dice) => Ok(warp::reply::json(&dice)),
                Err(e) => Err(warp::reject::custom(e)),
            }
        })
        .with(warp::trace::named("DICE"))
}

// POST /roll
fn roll(
    redis: redis::Client,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path("roll")
        .and(warp::post())
        .and(with_db(redis))
        .and(utils::with_validated_json())
        .and_then(|db: redis::Client, body: Request| async move {
            match dices::roll_dice(db, body.dice_type.expect("")).await {
                Ok(dice) => Ok(warp::reply::json(&dice)),
                Err(e) => Err(warp::reject::custom(e)),
            }
        })
        .with(warp::trace::named("ROLL"))
}

fn with_db(
    db: redis::Client,
) -> impl Filter<Extract = (redis::Client,), Error = std::convert::Infallible> + Clone {
    warp::any().map(move || db.clone())
}

#[derive(Deserialize, Serialize, Debug, Validate)]
struct Request {
    #[validate(required)]
    pub dice_type: Option<dice::DiceType>,
}

#[cfg(test)]
mod tests {
    use super::routes;
    use super::Request;
    use crate::models::dice::{Dice, DiceType};
    use redis::Commands;
    use warp::http::StatusCode;
    use warp::test::request;

    #[tokio::test]
    async fn test_dice() {
        let redis_host =
            std::env::var("REDIS_HOST").unwrap_or("redis://127.0.0.1:6379/".to_string());
        let redis = redis::Client::open(redis_host).unwrap();
        let mut con = redis.get_connection().unwrap();
        let api = routes(redis);
        let dice = dice();
        let _: () = con.set_ex("id", dice, 20).unwrap();
        let resp = request().method("GET").path("/id").reply(&api).await;

        assert_eq!(resp.status(), StatusCode::OK);
    }

    #[tokio::test]
    async fn test_roll() {
        let redis_host =
            std::env::var("REDIS_HOST").unwrap_or("redis://127.0.0.1:6379/".to_string());
        let redis = redis::Client::open(redis_host).unwrap();
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

    fn roll_request() -> Request {
        Request {
            dice_type: Some(DiceType::D20),
        }
    }
}
