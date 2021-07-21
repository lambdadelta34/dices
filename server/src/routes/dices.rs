use crate::handlers::dices;
use crate::models::dice;
use serde::{Deserialize, Serialize};
use warp::Filter;

pub fn routes() -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    roll().or(dice())
}

// GET /:id
fn dice() -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!(String).and_then(|id: String| async move {
        println!("IDX");
        let client = redis::Client::open("redis://127.0.0.1:6379/").unwrap();
        let mut con = client.get_async_connection().await.unwrap();
        match dices::find_dice(&mut con, id).await {
            Ok(dice) => Ok(warp::reply::json(&dice)),
            Err(_) => Err(warp::reject::not_found()),
        }
    })
}

// POST /roll
fn roll() -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("roll")
        // .and(warp::post())
        .and_then(|| async move {
            println!("ROLL");
            let client = redis::Client::open("redis://127.0.0.1:6379/").unwrap();
            let mut con = client.get_async_connection().await.unwrap();
            match dices::roll_dice(&mut con).await {
                Ok((id, dice)) => {
                    let result = RollResult { id, dice };
                    Ok(warp::reply::json(&result))
                }
                Err(_) => Err(warp::reject::not_found()),
            }
        })
}

// TODO: think through responses
#[derive(Serialize, Deserialize, Debug)]
struct RollResult {
    id: String,
    dice: dice::Dice,
}
