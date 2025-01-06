import AMapLoader from '@amap/amap-jsapi-loader'
export const useMapLocation = (address: string) => {
  window._AMapSecurityConfig = {
    securityJsCode: import.meta.env.VITE_AMAP_CODE
  }
  return new Promise((resolve, reject) => {
    AMapLoader.load({
      key: import.meta.env.VITE_AMAP_KEY, // 申请好的Web端开发者Key，首次调用 load 时必填
      version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: ['AMap.Geocoder']
    })
      .then((AMap) => {
        const geocoder = new AMap.Geocoder()
        geocoder.getLocation(address, function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            resolve(result.geocodes[0].location as any)
          } else {
            reject()
          }
        })
      })
      .catch((e) => {
        reject(e)
      })
  })
}
