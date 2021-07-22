use crate::handlers::dices;
use crate::models::dice;
use serde::{Deserialize, Serialize};
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
    warp::path!(String)
        .and(with_db(redis))
        .and_then(|id: String, db: redis::Client| async move {
            tracing::info!("ID {:?}", id);
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
    warp::path!("roll")
        .and(warp::post())
        .and(with_db(redis))
        .and(warp::body::json())
        .and_then(|db: redis::Client, body: Request| async move {
            tracing::info!("ROLL {:?}", body);
            match dices::roll_dice(db, body.dice_type).await {
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

#[derive(Deserialize, Serialize, Debug)]
struct Request {
    pub dice_type: dice::DiceType,
}
