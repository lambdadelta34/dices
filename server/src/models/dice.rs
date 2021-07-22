use nanoid::nanoid;
use rand::{thread_rng, Rng};
use serde::{Deserialize, Serialize};
use std::str::from_utf8;

type ID = String;

#[derive(Serialize, Deserialize, Debug)]
pub struct Dice {
    pub id: ID,
    pub dice_type: DiceType,
    pub number: u8,
}

impl Dice {
    pub fn create(dice_type: DiceType) -> Self {
        let id = nanoid!();
        let mut rng = thread_rng();
        let top_roll = match dice_type {
            DiceType::D4 => 4,
            DiceType::D6 => 6,
            DiceType::D8 => 8,
            DiceType::D10 => 10,
            DiceType::D12 => 12,
            DiceType::D20 => 20,
            DiceType::D100 => 100,
        };
        let number: u8 = rng.gen_range(1..=top_roll);
        Self {
            id,
            dice_type,
            number,
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub enum DiceType {
    D4,
    D6,
    D8,
    D10,
    D12,
    D20,
    D100,
}

impl redis::FromRedisValue for Dice {
    fn from_redis_value(v: &redis::Value) -> redis::RedisResult<Dice> {
        match v {
            redis::Value::Data(bytes) => {
                let data = from_utf8(bytes).unwrap().to_string();
                let dice = serde_json::from_str(&data).unwrap();
                Ok(dice)
            }
            _ => Err(redis::RedisError::from((
                redis::ErrorKind::TypeError,
                "Response type is not compatible",
            ))),
        }
    }
}

impl redis::ToRedisArgs for Dice {
    fn write_redis_args<W>(&self, out: &mut W)
    where
        W: ?Sized + redis::RedisWrite,
    {
        let data = serde_json::to_string(self).unwrap();
        out.write_arg(data.as_bytes())
    }
}
