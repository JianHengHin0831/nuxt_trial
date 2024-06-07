<template>
    <div class>
      <h1 class="text-2xl mt-4 items-center">{{ title }}</h1>
      <div v-if="title === 'Processing'">
        <div v-for="bot in bots" :key="bot.id" class="inline-block w-200 h-400 mr-4 mb-4">
          <div v-if="bot.status !== BotStatus.enum.Idle" class="bg-blue-500 text-white p-4 rounded-md shadow-md">
            <div class="text-2xl mt-4">
              <i class="fa fa-user text-3xl mr-2" aria-hidden="true"></i>
              Bot {{ bot.id }}
            </div>
            <div> 
              {{ bot.status }} - {{ bot.order }}
              <div v-if="bot.time"> 
                <div class="round-time-bar" :style="{'--duration': bot.time / 1000}" :key="bot.id">
                  <div></div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="bg-green-500 text-white p-4 rounded-md shadow-md">
            <div class="text-2xl mt-4">
              <i class="fa fa-user text-3xl mr-2" aria-hidden="true"></i>
              Bot {{ bot.id }}
            </div>
            <div> 
              {{ bot.status }}
            </div>
          </div>
        </div>
      </div>


      <div v-for="order in orders" :key="order.id">
        <div v-if="title !== 'Processing'"
           class="flex flex-row bg-blue-500 text-white p-4 m-2 rounded-md shadow-md">

          <div class="bg-white text-blue-500 p-1.5 ">
            {{ order.id }}
          </div>

          <div class="ml-2">
            {{ order.type.toUpperCase() }} Order : {{ order.status }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
<script lang="ts" setup>
import { BotStatus } from '../model';
import { defineProps } from 'vue';
  
defineProps<{ title: string; orders: Order[]; bots: Bot[] }>();

</script>

<style scoped>
  .round-time-bar {
    margin: 1rem;
    overflow: hidden;
  }
  .round-time-bar div {
    height: 5px;
    animation: roundtime calc(var(--duration) * 1s) steps(var(--duration))
      forwards;
    transform-origin: left center;
    background: linear-gradient(to bottom, red, #900);
  }

  .round-time-bar[data-style="smooth"] div {
    animation: roundtime calc(var(--duration) * 1s) linear forwards;
  }

  .round-time-bar[data-style="fixed"] div {
    width: calc(var(--duration) * 5%);
  }

  .round-time-bar[data-color="blue"] div {
    background: linear-gradient(to bottom, #64b5f6, #1565c0);
  }

  @keyframes roundtime {
    to {
      transform: scaleX(0);
    }
  }
</style>
