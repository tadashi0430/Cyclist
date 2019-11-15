function init(){
    //GET資料庫+RENDER畫面
    $.get('./php/CYShop.php', {}, function(data){
        //data: 只取prodType, prodName, prodPrice, prodColor, prodDetail, prodPic

        //////////基本載入////////////

        //計算頁數IIFE
        let countPagesBtn = [];
        (function(){ //計算頁數->Math.round(總數量/每頁顯示數量)
            // let len = data.length;
            // let show = 8;
            // let pages = Math.round(len/show);
            let pages = 3;
            countPagesBtn = pages;
        })();
        //////////功能變數///////////

        //select篩選器變數
        //let dateNew = order(data, "date"); //還沒建
        //let dateOld = order(data, "date", 1); //還沒建
        let priceLess = order(data, "price");
        let priceTop = order(data, "price", 1);

        //車型篩選器
        // let onRoad = typeFilter("prodType", 1); //1 = 公路車
        // let onMoun = typeFilter("prodType", 2); //2 = 登山車
        // let onCity = typeFilter("prodType", 3); //3 = 城市車

        //價格篩選器
        //waiting...

        //種類篩選器
        // let onAll = allBike(); //全車型
        // let decor = typeFilter("prodType", 4); //4 = 配件
        // let maint = typeFilter("prodType", 5); //5 = 保養品

        //顏色篩選器
        // let black = typeFilter("prodColor", "黑");
        // let white = typeFilter("prodColor", "白");
        // let red = typeFilter("prodColor", "紅");
        // let blue = typeFilter("prodColor", "藍");

        new Vue({
            el: '#prodRender',
            data: {
                prodList: data, //商品json [{obj1}, {obj2}, ...]
                prodAmount: data.length, //商品個數
                pagesBtn: countPagesBtn, //頁數
                pagesBtnIsFirst: true,
            },
            methods: {
                orderOnChange(event){ //排序變更
                    switch( parseInt(event.target.value) ){
                        case 1:
                            // this.prodList = dateNew;
                            // this.prodAmount = dateNew.length;
                            break;
                        case 2:
                            // this.prodList = dateOld;
                            // this.prodAmount = dateOld.length;
                            break;
                        case 3:
                            this.prodList = priceLess;
                            this.prodAmount = priceLess.length;
                            break;
                        case 4:
                            this.prodList = priceTop;
                            this.prodAmount = priceTop.length;
                            break;
                        default:
                            console.log(`onchange | ${event.target.value}`);
                    }
                },
                pageIsActive(e){ //更改頁數顏色
                    $(e.target).parent().children().removeClass("pages_active");
                    $(e.target).addClass("pages_active");
                },
            },
            computed: {

            },
        });
    }, "json")


    //商品組件
    Vue.component('prod-component', {
        props: ['pname','price','author'],
        methods: {
            clickToDetail(e){ //查看商品詳細
                e.stopPropagation();
                localStorage["prodName"] = "公路車"; //使用localStorage給下一頁撈資料
                window.open('./CYProd.html', '_self');
            },
            clickToAdd(e){
                //加入localStorage
                localStorage["cart-prodName"] = "越野車";

                //拿掉left會有問題
                $('.prod_cart').click(function(e){
                    e.stopPropagation();
                    let tmp = $(this).parent().parent().clone();
                    let axis = $(this).parent().parent().offset();
                    $('body').append(tmp);
                    tmp.offset(axis);
                    tmp.css({
                        width: $(this).parent().parent().css('width')
                    });
                    tmp.addClass('addToCart');
                    // console.log($(window).width());
                    TweenMax.to('.addToCart', .5, {
                        x: $(window).width()-$(tmp).offset().left-300,
                        y: -$(tmp).offset().top + $(window).scrollTop() - 130,
                        scale: 0,
                        onComplete: ()=>{
                            $('.addToCart').remove();
                        },
                        ease: Power2.easeIn
                    });
                });
            },
        },
        template: `
            <li class="prod col-5 col-lg-4 col-xl-3" @click.stop="clickToDetail">
                <div class="prod-shell">
                    <div class="prod-pic">
                        <img src=./images/TCR_SLR_M01.png>
                    </div>
                    <h3 class="prod-title">{{author}}</h3>
                    <p class="prod-context">{{pname}}</p>
                    <p class="prod-money">\${{price}}</p>
                    <div class="prodIcon">
                        <p class="prod_like"></p>
                        <p class="prod_cart" @click.stop="clickToAdd"></p>
                    </div>
                </div>
            </li>
        `,
    });



}

//排序
let order = function(object, key, orderby = 0){ //[{}, {}, {}]
    let row = object.slice();
    let len = row.length;
    if(orderby == 0){
        for(var i=0; i<len; i++){
            for(var j=0; j<len-1-i; j++){
                if(parseInt(row[j][key]) > parseInt(row[j+1][key])){
                    let tmp = row[j];
                    row[j] = row[j+1];
                    row[j+1] = tmp;
                }
            }
        }
    }else{
        for(var i=0; i<len; i++){
            for(var j=0; j<len-1-i; j++){
                if(parseInt(row[j][key]) < parseInt(row[j+1][key])){
                    let tmp = row[j];
                    row[j] = row[j+1];
                    row[j+1] = tmp;
                }
            }
        }
    }
    return row
}

//車型篩選
let typeFilter = function(key, type){
    let row = object.slice();
    let len = row.length;
    let result = [];
    for(let i=0; i<len; i++){
        if( parseInt(row[i][key]) == type ){
            result.push(row[i]);
        }
    }
    return result
}

//全車型選擇
let allBike = function(){
    let row = object.slice();
    let len = row.length;
    let result = [];
    for(let i=0; i<len; i++){
        if( parseInt(row[i]["prodType"]) !== 4 && parseInt(row[i]["prodType"]) !== 5 ){
            result.push(row[i]);
        }
    }
    return result
}

window.addEventListener('load', init, false);