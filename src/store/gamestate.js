/**
 * Returns current gamestate as a JSON string
 * @param {Object} state
 * @param state.players
 * @param state.edition
 * @param state.getters
 */
export function gamestateToJson({ players, edition, getters }) {
    return JSON.stringify({
        bluffs: players.bluffs.map(({ id }) => id),
        edition: edition.isOfficial
          ? { id: edition.id }
          : edition,
        roles: edition.isOfficial
          ? ""
          : getters.customRolesStripped,
        fabled: players.fabled.map(fabled =>
          fabled.isCustom ? fabled : { id: fabled.id }
        ),
        players: players.players.map(player => ({
          ...player,
          role: player.role.id || {}
        }))
    });
}

/**
 * Sets gamestate from a parsed JSON
 * @param data
 * @param store
 */
export function jsonToGamestate(data, store) {
    const { bluffs, edition, roles, fabled, players } = data;
    if (roles) {
        store.commit("setCustomRoles", roles);
    }
    if (edition) {
        store.commit("setEdition", edition);
    }
    if (bluffs.length) {
        bluffs.forEach((role, index) => {
        store.commit("players/setBluff", {
            index,
            role: store.state.roles.get(role) || {}
        });
        });
    }
    if (fabled) {
        store.commit("players/setFabled", {
        fabled: fabled.map(
            f =>
            store.state.fabled.get(f) ||
            store.state.fabled.get(f.id) ||
            f
        )
        });
    }
    if (players) {
        store.commit(
        "players/set",
        players.map(player => ({
            ...player,
            role:
            store.state.roles.get(player.role) ||
            store.getters.rolesJSONbyId.get(player.role) ||
            {}
        }))
        );
    }
}