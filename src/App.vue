<template>
  <div id="app">
    <div class="navbar">
      <h1>
        台灣空氣品質指標(AQI)
      </h1>
      <div class="navbar-select">
        <select v-model="city">
          <option value="">所有城市</option>
          <option :value="city" v-for="city in cityList" :key="city">
            {{ city }}
          </option>
        </select>
      </div>
    </div>
    <div class="map">
      <l-map ref="myMap" :zoom="zoom" :center="center" :options="options">
        <l-tile-layer :url="url" :attribution="attribution" />

        <l-marker ref="location" :lat-lng="currentLocation">
          <l-popup class="map-content">
            你的位置
          </l-popup>
        </l-marker>

        <l-marker
          :lat-lng="[item.Latitude, item.Longitude]"
          v-for="(item, i) in filterCityData"
          :key="i"
        >
          <l-icon
            :icon-url="icon.type[item.iconColor]"
            :shadow-url="icon.shadowUrl"
            :icon-size="icon.iconSize"
            :icon-anchor="icon.iconAnchor"
            :popup-anchor="icon.popupAnchor"
            :shadow-size="icon.shadowSize"
          />

          <l-popup class="map-content">
            <p>{{ item.SiteName }}</p>

            空氣品質: {{ item.AQI }}

            <p>{{ item.PublishTime }}</p>
          </l-popup>
        </l-marker>
      </l-map>

      <div class="map-sup">
        ?
        <table class="map-table">
          <thead>
            <tr class="map-table-title">
              <th>AQI指數</th>
              <th>人體影響</th>
            </tr>
          </thead>
          <tbody>
            <tr class="map-table-green">
              <td>0~50</td>
              <td>良好</td>
            </tr>
            <tr class="map-table-yellow">
              <td>51~100</td>
              <td>普通</td>
            </tr>
            <tr class="map-table-orange">
              <td>101~150</td>
              <td>對敏感族群不健康</td>
            </tr>
            <tr class="map-table-red">
              <td>151~200</td>
              <td>對所有族群不健康</td>
            </tr>
            <tr class="map-table-violet">
              <td>201~300</td>
              <td>非常不健康</td>
            </tr>
            <tr class="map-table-black">
              <td>301~500</td>
              <td>危害</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      zoom: 10,
      currentLocation: [22.612961, 120.304167],
      center: [22.612961, 120.304167],
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: `© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors`,
      options: {
        zoomControl: false
      },
      icon: {
        type: {
          green:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
          yellow:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png",
          orange:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
          red:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
          violet:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
          black:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png"
        },
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      },

      city: "",
      cityList: [],
      aqiData: []
    };
  },
  computed: {
    filterCityData() {
      if (!this.city) {
        this.center = this.currentLocation;
        return this.aqiData;
      }
      const searchData = this.aqiData.filter(item => item.County === this.city);
      this.center = [searchData[0].Latitude, searchData[0].Longitude];
      return searchData;
    }
  },
  methods: {
    getAqiData() {
      const api =
        "https://cors-anywhere.herokuapp.com/https://opendata.epa.gov.tw/webapi/api/rest/datastore/355000000I-000259?sort=SiteName&offset=0&limit=1000";
      this.axios.get(api).then(res => {
        this.aqiData = res.data.result.records;
        this.getCityList();
      });
    },
    getCityList() {
      let list = new Set();
      this.aqiData.forEach(item => {
        if (0 <= item.AQI && item.AQI <= 50) item.iconColor = "green";
        if (51 <= item.AQI && item.AQI <= 100) item.iconColor = "yellow";
        if (101 <= item.AQI && item.AQI <= 150) item.iconColor = "orange";
        if (151 <= item.AQI && item.AQI <= 200) item.iconColor = "red";
        if (201 <= item.AQI && item.AQI <= 300) item.iconColor = "violet";
        if (301 <= item.AQI && item.AQI <= 500) item.iconColor = "black";
        list.add(item.County);
      });
      this.cityList = Array.from(list);
    },
    getCurrentLocation() {
      navigator.geolocation.getCurrentPosition(position => {
        const p = position.coords;
        this.currentLocation = [p.latitude, p.longitude];
        this.center = [p.latitude, p.longitude];
        this.$refs.location.mapObject.openPopup();
      });
    }
  },
  mounted() {
    this.getAqiData();
    this.$nextTick(() => {
      this.getCurrentLocation();
    });
  }
};
</script>
