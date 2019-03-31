//Add a link to your data object, and use v-bind to sync it up with an anchor tag in your HTML. Hint: you’ll be binding to the href attribute.
let eventBus = new Vue()

Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `
    <div class="product">
  
      <div class="product-image">
        <img :src="image" />
  
      </div>

      <div class="product-info">
        <h1>{{ title }}</h1>
        <p>{{ onSaleProp }}</p>
        <p v-if="inStock">{{ 'In Stock - ' + inStock + ' available' }}</p>
        <p v-else
           v-bind:class="{ outOfStock: !inStock }">{{ 'Out of Stock - ' + inStock + ' available' }}</p>
        <info-tabs :shipping="shipping" :details="details"></info-tabs>
        <div>
          <div class="color-box" 
               v-for="(variant, index) in variants" 
               :key="variant.variantId" 
               v-bind:style="{ background: variant.variantColor }"
               v-on:mouseover="updateProduct(index)">
          </div>
        </div>
        <div class="buttons">
          <button v-on:click="addToCart"
                  :disabled="!inStock"
                  :class="{ disabledButton: !inStock }">Add to Cart</button>
          <button v-on:click="removeFromCart">Remove</button>
        </div>
      </div>
      <product-tabs :reviews="reviews"></product-tabs>
    </div>
  `,
  data() {
    return {
      brand: 'Vue Mastery',
      product: 'Socks',
      selectedVariant: 0,
      onSale: true,
      details: ["80% cotton", "20% polyester", "Male"],
      variants: [
        { 
          variantId: 2234,
          variantColor: 'green',
          variantImage: 'https://www.vuemastery.com/images/challenges/vmSocks-green-onWhite.jpg',
          variantQuantity: 10
        },
        {
          variantId: 2235,
          variantColor: 'blue',
          variantImage: 'https://www.vuemastery.com/images/challenges/vmSocks-blue-onWhite.jpg',
          variantQuantity: 2
        }
      ],
      reviews: []
    }
  },
  methods: {
    addToCart: function() {
      this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
    },
    removeFromCart: function() {
     this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
    },
    updateProduct: function(img) {
      this.selectedVariant = img
      console.log(img)
    }
  },
  computed: {
    title: function() {
      return this.brand + ' ' + this.product
    },
    image: function() {
      return this.variants[this.selectedVariant].variantImage 
    },
    inStock: function() {
      return this.variants[this.selectedVariant].variantQuantity
    },
    onSaleProp: function() {
      if(this.onSale) {
         return this.brand + ' ' + this.product + ' are on sale!'
      }
    },
    shipping: function() {
      if(this.premium) {
        return 'Free'
      }else {
        return 2.99
      }
    }
  },
  mounted() {
    eventBus.$on('review-submitted', productReview => {
      this.reviews.push(productReview)
    })
  }
})

Vue.component('product-details', {
  props: {
    details: {
      type: Array,
      required: true
    }
  },
  template: `
    <ul>
      <li v-for="detail in details">{{ detail }}</li>
    </ul>
  `
})

Vue.component('product-review', {
  template: `
    <form class="review-form" @submit.prevent="onSubmit">

      <p v-if="errors.length">
        <b>Please fix the following error(s)</b>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul
      </p>
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name">
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review"></textarea>
      </p>
      
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>

      <p>Would you recommend this product?</label</p>
      <input type="radio" name="recommend" v-model="recommend" value="Yes">Yes
      <input type="radio" name="recommend" v-model="recommend" value="No">No

      <p>
        <input type="submit" value="Submit">  
      </p>    
    
    </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recommend: null,
      errors: []
    }
  },
  methods: {
    onSubmit: function() {
      if(this.name && this.review && this.rating && this.recommend) {
         let productReview = {
           name: this.name,
           review: this.review,
           rating: this.rating,
           recommend: this.recommend
         }
         eventBus.$emit('review-submitted', productReview)
         this.name = null
         this.review = null
         this.rating = null
         this.recommend = null
      }else {
        if(!this.name) this.errors.push('Name required');
        if(!this.review) this.errors.push('Review required');
        if(!this.rating) this.errors.push('Rating required');
        if(!this.recommend) this.errors.push('Recommendation required');
      }
    }
  }
})

Vue.component('product-tabs', {
  props: {
    reviews: {
      type: Array,
      required: true
    }
  },
  template: `
    <div class="tab-container">
      <div>
        <span class="tab"
              :class="{ activeTab: selectedTab === tab}"
              v-for="(tab, index) in tabs"
              :key="index"
              @click="selectedTab = tab">{{ tab }}</span>
      </div>

      <div v-show="selectedTab === 'Reviews'">
        <p v-if="!reviews.length">There is no reviews yet.</p>
        <ul>
          <li v-for="review in reviews">
          <p>{{ review.name }}</p>
          <p>Rating: {{ review.rating }}</p>
          <p>{{ review.review }}</p>
          <p>{{ review.recommend }}</p>
          </li>
        </ul>
      </div>
      <product-review v-show="selectedTab === 'Make a Review'"></product-review>
    </div>
  `,
  data() {
    return {
      tabs: ['Reviews', 'Make a Review'],
      selectedTab: 'Reviews'
    }
  }
})

Vue.component('info-tabs', {
  props: {
    shipping: {
      required: true
    },
    details: {
      type: Array,
      required: true
    }
  },
  template: `
    <div class="tab-container">
      <div>
        <span class="tab"
              :class="{activeTab:selectedTab === tab}"
              v-for="(tab, index) in tabs"
              :key="index"
              @click="selectedTab = tab">{{ tab }}</span>
      </div>

      <div v-show="selectedTab === 'Shipping'">
          <p>{{ shipping }}</p>
        </div>
      <div v-show="selectedTab === 'Details'">
          <product-details :details="details"></product-details>
      </div>
    </div>
  `,
  data() {
    return {
      tabs: ['Shipping', 'Details'],
      selectedTab: 'Shipping'
    }
  }
})

var app = new Vue({
  el: '#app',
  data: {
    premium: false,
    cart: [],
    animated: false
  },
  methods: {
    updateCart: function(id) {
      this.cart.push(id)
      this.animated = true
    },
    remove: function(id) {
       this.cart.splice(this.cart.indexOf(id), 1)
    }
  }
})