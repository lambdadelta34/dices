use crate::models::dice;
use crate::utils;

pub async fn find_dice(redis: redis::Client, id: String) -> utils::Result<dice::Dice> {
    let mut connection = redis
        .get_tokio_connection()
        .await
        .map_err(|_e| utils::Error::GenericError)?;
    match redis::cmd("GET")
        .arg(&id)
        .query_async(&mut connection)
        .await
    {
        Ok(dice) => Ok(dice),
        Err(_) => Err(utils::Error::GenericError),
    }
}

pub async fn roll_dice(
    redis: redis::Client,
    dice_type: dice::DiceType,
) -> utils::Result<dice::Dice> {
    let mut connection = redis
        .get_tokio_connection()
        .await
        .map_err(|_e| utils::Error::GenericError)?;

    let dice = dice::Dice::create(dice_type);
    let _: () = redis::cmd("SETEX")
        .arg(&dice.id)
        .arg(600)
        .arg(&dice)
        .query_async(&mut connection)
        .await
        .map_err(|_e| utils::Error::GenericError)?;
    Ok(dice)
}
