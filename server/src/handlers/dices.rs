use crate::models::dice;
use crate::utils;
use nanoid::nanoid;

pub async fn find_dice(
    redis: &mut redis::aio::Connection,
    id: String,
) -> Result<dice::Dice, utils::Error> {
    match redis::cmd("GET").arg(&id).query_async(redis).await {
        Ok(dice) => Ok(dice),
        Err(_) => Err(utils::Error::Error),
    }
}

pub async fn roll_dice(
    redis: &mut redis::aio::Connection,
) -> Result<(String, dice::Dice), utils::Error> {
    let key = nanoid!();
    let dice = dice::Dice {
        dice_type: dice::DiceType::D20,
        number: 2,
    };
    let _: () = redis::cmd("SETEX")
        .arg(&key)
        .arg(600)
        .arg(&dice)
        .query_async(redis)
        .await
        .unwrap();
    Ok((key, dice))
}
