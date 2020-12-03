var eventBus = new Vue()
Vue.component ('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
    <div>
    <div class="nav-bar"></div>
    <div class="product">
        <div class="product-image">
            <img v-bind:src="image" alt="">

        </div>
        <div class="product-info">
            <h1>{{ title }}</h1>
            <p v-if="amount">On sale!</p>
            <p v-else >Sold out!</p>
            <div v-for="detail in details">
                {{ detail }}
            </div><br>
            <p>Shipping: {{shipping}}</p>

            <div v-for="(variant,index) in variants"
            :key = "variant.variantId"
            class="color-box"
            v-bind:style="{backgroundColor: variant.variantColor}"
            v-on:mouseover="updateProduct(index)"
            
            >

            </div>

            <button v-on:click="addToCart"
            v-bind:disabled="!amount"
            v-bind:class="{disabledButton: !amount}"
            
            >Add Cart</button>
        </div>
        
        <product-tabs :reviews="reviews"></product-tabs>
        

        
    </div>


</div>
    `,
    data() {
        return {
            brand: 'Vue Mastery',
        product: 'socks',
        selectedVariant: 0,
        details: ['80%cotton','20%polyster','Gender-natural'],
        variants: [
            {
                variantId: 2234,
                variantColor: 'green',
                variantImage: '1.jpg',
                variantQuantity: 10
            },
            {
                variantId: 2235,
                variantColor: 'purple',
                variantImage: '2.jpg',
                variantQuantity: 0
            }
        ],
           reviews: []
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        updateProduct(index) {
            this.selectedVariant = index

        },

    },
    computed: {
        title() {
            return this.brand+ ' ' + this.product
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        amount() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        shipping() {
            if(this.premium) {
                return 'free'
            }else {
                return 2.99
            }
        }
    },
    mouted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    }
}

)
Vue.component ('product-review',{
    template: `
    <form class="review-form" @submit.prevent="onSubmit">

      <p>
        <ul v-for="error in errors">
            <li>
            {{ error }}
            </li>
        </ul>
      </p>

      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
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

      <p>Would you recommend this product?</p>
        <label>
          Yes
          <input type="radio" value="Yes" v-model="recommend"/>
        </label>
        <label>
          No
          <input type="radio" value="No" v-model="recommend"/>
        </label>
          
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
        
        onSubmit() {
            if(this.name && this.review && this.rating) {
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
                if(!this.name) this.errors.push('Name is required')
                if(!this.review) this.errors.push('review is required')
                if(!this.rating) this.errors.push('rating is required')
                if(!this.recommend) this.errors.push('recommend is required') 
            }

        }
            
    }
})
Vue.component('product-tabs',{
    props: {
        reviews: {
            type: Array,
            required: true
        }

    },
    template: `
    <div>
        <span class="tab"
        :class="{activeTab: selectedTab === tab}"
        v-for="(tab,index) in tabs"
        :key="index"
        @click="selectedTab = tab"

        >{{tab}}</span>
        <div v-show="selectedTab === 'Reviews'">
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul>
                  <li v-for="(review, index) in reviews" :key="index">
                    <p>{{ review.name }}</p>
                    <p>Rating:{{ review.rating }}</p>
                    <p>{{ review.review }}</p>
                    <p>Recommend: {{ review.recommend }}</p>
                  </li>
            </ul>
        </div>

        <product-review v-show="selectedTab === 'Make a review'"
        ></product-review> 
    </div>
    
    `,
    data() {
        return {
            tabs: ['Reviews','Make a review'],
            selectedTab: 'Reviews'
        }
    }
})

var app = new Vue ({
    el: '#app',
    data: {
        premium: false,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id) 
        },
        
    }
    
})