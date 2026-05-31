<template>
  <Modal
    class="game-state"
    v-if="modals.gameState"
    @close="toggleModal('gameState')"
  >
    <h3>Aktuální stav hry</h3>
    <textarea
      :value="gamestate"
      @input.stop="input = $event.target.value"
      @click="$event.target.select()"
      @keyup.stop=""
    ></textarea>
    <div class="button-group">
      <div class="button townsfolk" @click="copy">
        <font-awesome-icon icon="copy" /> Zkopírovat JSON
      </div>
      <div class="button demon" @click="load" v-if="!session.isSpectator">
        <font-awesome-icon icon="cog" /> Načíst stav
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from "./Modal";
import { mapMutations, mapState } from "vuex";
import { gamestateToJson, jsonToGamestate } from "../../store/gamestate";

export default {
  components: {
    Modal
  },
  computed: {
    gamestate() {
      return gamestateToJson({
        players: this.players,
        edition: this.edition,
        getters: this.$store.getters})
    },
    ...mapState(["modals", "players", "edition", "roles", "session"])
  },
  data() {
    return {
      input: ""
    };
  },
  methods: {
    copy: function() {
      navigator.clipboard.writeText(this.input || this.gamestate);
    },
    load: function() {
      if (this.session.isSpectator) return;
      try {
        const data = JSON.parse(this.input || this.gamestate);
        jsonToGamestate(data, this.$store);
        this.toggleModal("gameState");
      } catch (e) {
        alert("Unable to parse JSON: " + e);
      }
    },
    ...mapMutations(["toggleModal"])
  }
};
</script>

<style lang="scss" scoped>
@import "../../vars.scss";

h3 {
  margin: 0 40px;
}

textarea {
  background: transparent;
  color: white;
  white-space: pre-wrap;
  word-break: break-all;
  border: 1px solid rgba(255, 255, 255, 0.5);
  width: 60vw;
  height: 30vh;
  max-width: 100%;
  margin: 5px 0;
}
</style>
