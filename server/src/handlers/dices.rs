use crate::models::dice;
use crate::utils;

pub async fn find_dice(
    id: String,
    db: impl utils::DBConnection,
) -> utils::WebResult<impl warp::Reply> {
    match db.get_dice(id).await {
        Ok(dice) => Ok(warp::reply::json(&dice)),
        Err(e) => Err(warp::reject::custom(e)),
    }
}

pub async fn roll_dice(
    db: impl utils::DBConnection,
    body: utils::Request,
) -> utils::WebResult<impl warp::Reply> {
    match body.dice_type {
        Some(dice_type) => {
            let dice = dice::Dice::create(dice_type);
            db.set_dice(&dice).await;
            Ok(warp::reply::json(&dice))
        }
        None => Err(warp::reject::not_found()),
    }
}
