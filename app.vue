<template>
  <div class="container-md min-h-screen bg-gray-100 flex flex-col gap-8 items-center justify-center">
    <h1 class="text-4xl font-bold">McDonald's Order Management</h1>
    <router-view/>
  
    <div class="controls flex space-x-4">
      <div class="p-4 bg-yellow-500 rounded-md"> 
        <h2>Orders</h2>
        <button class="bg-blue-500 text-white px-4 m-2 py-2 rounded" @click="createOrder(OrderType.enum.Normal)">New Normal Order</button>
        <button class="bg-blue-500 text-white px-4 py-2 rounded" @click="createOrder(OrderType.enum.VIP)">New VIP Order</button>
      </div>
      
      <BotControl :bots="bots" @add-bot="addBot" @remove-bot="removeBot" />
    </div>
    <div class="container grid grid-cols-3 gap-4  justify-center">
      <!-- <router-link :to="{ name: 'PendingOrders', params: { orders: pendingOrders } }"> -->
        <OrderList title="Pending" class="p-4 bg-red-500 text-white rounded-md min-h-[400px]" :orders="pendingOrders" :bots="bots"/>
      <!-- </router-link> -->

      <!-- <router-link :to="{ name: 'ProcessingOrders', params: { orders: processingOrders } }"> -->
        <OrderList title="Processing" class="p-4 bg-yellow-500 text-white rounded-md min-h-[400px]" :orders="processingOrders" :bots="bots" />
      <!-- </router-link> -->

      <!-- <router-link :to="{ name: 'CompletedOrders', params: { orders: completedOrders } }"> -->
        <OrderList title="Complete" class="p-4 bg-green-500 text-white rounded-md min-h-[400px]" :orders="completedOrders" :bots="bots" />
      <!-- </router-link> -->
    </div>
    

    <!-- <h1>{{ counterStore.count }}</h1>
    <button class="bg-blue-500 text-white px-4 py-2 rounded"  @click="counterStore.increment">increase 1</button> -->

  </div>
</template>

<script setup lang="ts">
import BotControl from '@/components/BotControl.vue';
import OrderList from '@/components/OrderList.vue';
import { ref, reactive, watch } from 'vue';
import { Order, Bot, BotStatus, OrderStatus, OrderType } from './model';
// import { useCounterStore } from './stores/counter';
import './assets/main.css'
// const counterStore = useCounterStore()

type BotTimeouts = Record<number, ReturnType<typeof setTimeout>>;

const orderCount = ref(0);
const bots = reactive<Bot[]>([]);
const pendingOrders = reactive<Order[]>([]);
const processingOrders = reactive<Order[]>([]);
const completedOrders = reactive<Order[]>([]);
const botTimeouts = reactive<BotTimeouts>({});

const BOT_ORDER_PROCESSING_TIME = {
  [OrderType.enum.Normal]: 10000,
  [OrderType.enum.VIP]: 5000,
} as const;

watch(
  () => [pendingOrders, bots, completedOrders],
  () => {
    processOrders();
  },
  { deep: true }
)

function createOrder(type: OrderType) {
  //create order based on type (normal/ vip)
  const order: Order = { id: ++orderCount.value, type, status: OrderStatus.enum.Pending };
  try {
    Order.parse(order);
  } catch (err) {
    console.error(err);
    window.alert(err);
    return;
  }

  //if type == normal then just push at the back
  if (type === OrderType.enum.Normal) {
    pendingOrders.push(order);
    return;
  }

  //if type === vip then find first normal order and put the object in front of that
  const vipIndex = pendingOrders.findIndex(order => order.type === OrderType.enum.Normal);
  if (vipIndex !== -1) {
    pendingOrders.splice(vipIndex, 0, order);
  } else {
    pendingOrders.push(order);
  }
}

function addBot() {
  //creat bot object and put in the bots array
  const bot: Bot = { id: bots.length + 1, status: BotStatus.Enum.Idle, order:null, time: null}
  const parseBot = Bot.parse(bot)
  bots.push(bot);
}

function removeBot() {
  //if has any bot, then remove last bot
  if (bots.length <= 0) return;
  //if the bot still processing the order, clear the order and put the order back to the pending order
  const index = bots[bots.length - 1].order;
  const botId = bots[bots.length - 1].id;
  if (index) {
    clearTimeout(botTimeouts[botId]);
    const order = processingOrders.find(order=>order.id = index)
    console.log(processingOrders.length)
    if(!order)return;
    order.status = OrderStatus.enum.Pending;
    pendingOrders.unshift(order);
  }
  bots.pop();
}
function processOrders() {
  let botProcessingTime = 10000;

  //if have any bot that is idle and have any pending order, then process order
  if (bots.length <= 0  || pendingOrders.length <= 0) {
    return;
  }

  //take idle bot id
  const idleBotId = idleBotID();

  //return if no idle bot
  if (idleBotId === null) return;

  const bot = bots.find(b => b.id === idleBotId);
  if (!bot) return;
  const order = pendingOrders.shift();
  //return if no pending order
  if (!order) return; 

  //add the order into processing orders
  order.status = OrderStatus.enum.Processing;
  processingOrders.push(order);
  botProcessingTime = BOT_ORDER_PROCESSING_TIME[order.type];

  //change bot status
  
  bot.status = BotStatus.enum.Working;
  bot.order = order.id;
  bot.time = botProcessingTime;
  startBot(bot, order);
}

function startBot(bot: Bot, order: Order) {
  console.log(bot.id)
  //run the bot
  botTimeouts[bot.id] = setTimeout(() => {
    //complete
    delete botTimeouts[bot.id];
    order.status = OrderStatus.enum.Completed;
    const index = processingOrders.findIndex(o => o.id === order.id);
    if (index !== -1) {
      processingOrders.splice(index, 1); 
    }
    completedOrders.push(order);
    const foundBot = bots.find(b => b.id === bot.id);

    //change bot status
    if (foundBot) {
      foundBot.status = BotStatus.Enum.Idle;
      foundBot.order = null
    }
  }, bot.time!);
}
    
function idleBotID(){
  //take the first bot that is IDLE
  const foundBot = bots.find(bot => bot.status === BotStatus.Enum.Idle);
  return foundBot?.id || null;
}
</script>

<style scoped>
/* .container {
  display: flex;
  justify-content: space-around;
} */

/* .controls {
  text-align: center;
  margin-bottom: 20px;
} */
</style>
