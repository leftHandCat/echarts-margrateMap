function MARGRATE_MAP(){
    var mapChart = echarts.init(document.getElementById('mapDiv'));

    var opts =  {
        tooltip : {
            trigger: 'item',
            show:false
        },
        grid:{
            show:false,
            width:'100%',
            height: '100%'
        },
        legend: {
            orient: 'vertical',
            top: 'bottom',
            left: 'right',
            data:[],
            textStyle: {
                color: '#fff'
            },
            selectedMode: 'single'
        },
        geo: {
            map: 'china',  //world
            left:0,
            top:0,
            right:100,
            bottom:50,
            label: {
                emphasis: {
                    show: false
                }
            },
            roam: false,
            itemStyle: {
                normal: {
                    areaColor: '#053682',
                    borderColor: '#1d4887',
                    borderWidth: 2
                },
                emphasis: {
                    areaColor: '#053682'
                }
            }
        },
        series: setMapData()
    };

    mapChart.setOption(opts)
}

function setMapData(){

    var geoCoordMap = {
        '陇南市': [104.920448,33.406619],
        '拉萨': [91.11935,29.650504],
        '兰州': [103.839722,36.066717],
        '太原': [116.4551,40.2539],
        '昌都': [97.175865,31.148843],
        '成都': [104.08073,30.655831]
    };

    var longNanData = [
      //  [{name:'陇南市'}, {name:'陇南市',value:20}],
        [{name:'陇南市'}, {name:'拉萨',value:30}],
        [{name:'陇南市'},{name:'兰州',value:30}],
        [{name:'陇南市'}, {name:'太原',value:30}],
        [{name:'陇南市'}, {name:'昌都',value:30}],
        [{name:'太原'}, {name:'成都',value:30}]       
    ];

    var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';

    var convertData = function (data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
            var dataItem = data[i];

            var fromCoord = geoCoordMap[dataItem[1].name];
            var toCoord = geoCoordMap[dataItem[0].name];

            var lineColor = "#fff";

            if(dataItem[1].name === "成都"){
                lineColor = '#de0015';
            }

            if (fromCoord && toCoord) {

                res.push({
                    fromNametoName: dataItem[1].name,
                    toName: dataItem[0].name,
                    coords: [fromCoord, toCoord],
                    lineStyle:{
                        normal:{
                            color: lineColor,
                            width:0.8
                        }
                    }
                });
            }
        }
        return res;
    };

    var color = ['#fff', '#fff', '#46bee9'];
    var series = [];

    [['陇南市', longNanData]].forEach(function (item, i) {

        series.push(
        {
            name: item[0] + ' Top10',  //line
            type: 'lines',
            zlevel: 2,
            symbol: ['none'],
            symbolSize: 10,
            effect: {
                show: true,
                symbolSize: 5,
                period: 8,
                shadowBlur: 6
            },
            lineStyle: {
                normal: {
                    color: color[i],
                    width: 1,
                    opacity: 0.6,
                    curveness: 0.2
                }
            },
            data: convertData(item[1])
        },
        {
            name: item[0] + ' Top10',   //label
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 2,
            rippleEffect: {
                brushType: 'stroke'
            },
            label: {
                normal: {
                    show: true,
                    position: 'right',
                    formatter: function(param){
                        if(param.name !== '陇南市'){
                            return param.name;
                        }else{
                            return '';
                        }
                    },
                    textStyle:{
                        fontWeight:'normal',
                        fontSize:12,
                    }
                }
            },
            symbolSize: function (val) {
                return val[2] / 8;
            },
            itemStyle: {
                normal: {
                    color: color[i]
                }
            },
            data: item[1].map(function (dataItem) {        //label 颜色
                return {
                    name: dataItem[1].name,
                    value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value]),
                    itemStyle:{
                        normal: {
                            color: (function(){
                                if (dataItem[1].name == "成都"){
                                    return "#de0015"
                                }else{
                                    return "#fff"
                                }
                            }())
                        }
                    }
                };
            })
        });
    });

    return series;
}


 MARGRATE_MAP();