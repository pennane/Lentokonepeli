use dogfight_macros::{EnumBytes, Networked};

use crate::network::{
    property::*, EntityChange, EntityChangeType, EntityProperties, NetworkedEntity,
};

use super::types::{EntityType, Team};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, TS, EnumBytes)]
#[ts(export)]
pub enum WorldState {
    Intermission,
    Playing,
    PostGame,
}

#[derive(Networked)]
pub struct WorldInfo {
    #[rustfmt::skip]
    state: Property<Option::<WorldState>>,
    #[rustfmt::skip]
    winner: Property<Option::<Team>>,
    game_time_remaining: Property<u16>,
}

impl WorldInfo {
    pub fn new() -> Self {
        Self {
            state: Property::new(Some(WorldState::Intermission)),
            winner: Property::new(None),
            game_time_remaining: Property::new(0),
        }
    }

    pub fn set_state(&mut self, state: WorldState) {
        self.state.set(Some(state));
    }

    pub fn get_state(&self) -> Option<WorldState> {
        *self.state.get()
    }

    pub fn set_winner(&mut self, winner: Option<Team>) {
        self.winner.set(winner);
    }

    pub fn get_game_time_remaining(&self) -> u16 {
        *self.game_time_remaining.get()
    }

    pub fn set_game_time_remaining(&mut self, seconds: u16) {
        self.game_time_remaining.set(seconds);
    }

    pub fn get_all_full_state(&self) -> EntityChange {
        EntityChange {
            ent_type: EntityType::WorldInfo,
            id: 0,
            update: EntityChangeType::Properties(self.get_full_properties()),
        }
    }

    pub fn get_all_changed_state(&mut self) -> EntityChange {
        EntityChange {
            ent_type: EntityType::WorldInfo,
            id: 0,
            update: EntityChangeType::Properties(self.get_changed_properties_and_reset()),
        }
    }
}
