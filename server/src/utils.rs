use crate::models;
use async_trait::async_trait;
use serde::de::DeserializeOwned;
use serde::{Deserialize, Serialize};
use validator::{Validate, ValidationErrors};
use warp::Filter;

#[async_trait]
pub trait DBConnection: Send + Sync + Clone + 'static {
    async fn get_dice(&self, id: String) -> Result<models::dice::Dice>;
    async fn set_dice(&self, dice: &models::dice::Dice);
}

#[async_trait]
impl DBConnection for redis::aio::ConnectionManager {
    async fn get_dice(&self, id: String) -> Result<models::dice::Dice> {
        let conn = &mut self.clone();
        match redis::cmd("GET").arg(&id).query_async(conn).await {
            Ok(dice) => Ok(dice),
            Err(_) => Err(Error::GenericError),
        }
    }

    async fn set_dice(&self, dice: &models::dice::Dice) {
        let conn = &mut self.clone();
        redis::cmd("SETEX")
            .arg(&dice.id)
            .arg(600)
            .arg(&dice)
            .query_async::<_, ()>(conn)
            .await
            .map_err(|_e| Error::GenericError)
            .unwrap();
    }
}

#[async_trait]
impl DBConnection for redis::Client {
    async fn get_dice(&self, id: String) -> Result<models::dice::Dice> {
        let mut connection = self
            .get_tokio_connection()
            .await
            .map_err(|_e| Error::GenericError)
            .unwrap();
        match redis::cmd("GET")
            .arg(&id)
            .query_async(&mut connection)
            .await
        {
            Ok(dice) => Ok(dice),
            Err(_) => Err(Error::GenericError),
        }
    }

    async fn set_dice(&self, dice: &models::dice::Dice) {
        let mut connection = self
            .get_tokio_connection()
            .await
            .map_err(|_e| Error::GenericError)
            .unwrap();

        redis::cmd("SETEX")
            .arg(&dice.id)
            .arg(600)
            .arg(&dice)
            .query_async::<_, ()>(&mut connection)
            .await
            .map_err(|_e| Error::GenericError)
            .unwrap();
    }
}

pub type Result<T> = std::result::Result<T, Error>;
pub type WebResult<T> = std::result::Result<T, warp::Rejection>;

#[derive(Deserialize, Serialize, Debug, Validate)]
pub struct Request {
    #[validate(required)]
    pub dice_type: Option<models::dice::DiceType>,
}

#[derive(Debug)]
pub enum Error {
    GenericError,
    Validation(ValidationErrors),
}
impl warp::reject::Reject for Error {}

#[derive(Serialize)]
pub struct ErrorMessage {
    pub message: String,
}

pub fn with_validated_json<T>() -> impl Filter<Extract = (T,), Error = warp::Rejection> + Clone
where
    T: DeserializeOwned + Validate + Send,
{
    warp::body::content_length_limit(1024 * 2)
        .and(warp::body::json())
        .and_then(|value| async move { validate(value).map_err(warp::reject::custom) })
}

fn validate<T>(value: T) -> Result<T>
where
    T: Validate,
{
    value.validate().map_err(Error::Validation)?;

    Ok(value)
}
