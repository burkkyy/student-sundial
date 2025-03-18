<template>
  <v-card
    class="toggle fill-height"
    :to="{ name: 'decisions/DecisionNewPage' }"
  >
    <v-card-text class="d-flex">
      <span class="d-sm-flex align-center me-3 d-none">
        <v-icon size="50px">mdi-call-split</v-icon>
      </span>

      <div>
        <div class="text-h6">Record a Decision</div>
        <span class="text-subtitle-2"
          >Decisions are written to the archive and may include attachments and other
          metadata.</span
        >
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup></script>
