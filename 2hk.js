
const LoginLink = "https://www.hackerrank.com/auth/login";
const emailpassObj = require("./Screts");
const {answers} = require("./codes");
const puppeteer = require("puppeteer");
const fs = require("fs");

let browserStartPromise = puppeteer.launch({
    //visible
    headless: false,
    //type 1sec
    // slowMo: 1000,

    defaultViewport:null,

//maximize the window:-
    args: ["--start-maximized" , "--disable-notifications"]
});
//browser ka promise mil rha hai.

let page , browser, rTab;

browserStartPromise.then(function(browserObj){
    //console.log("browser opened");
    //new tab open 
    browser = browserObj;//objects that are used to manipulate methods and properties of the Web page loaded in the browser window. 
    let browserTabOpenPromise = browserObj.newPage();
    return browserTabOpenPromise; // promise return karte ho or iss promise ka result niche wale then mei mil jata
    //create new tab

}).then(function(newTab){
    page = newTab;
    console.log("new tab opened");
    let gPageOpened =  newTab.goto(LoginLink);//new page will go to the written browser:::
    return gPageOpened;
}).then(function(){
    let emailWillBeEnteredPromise = page.type("#input-1", emailpassObj.email, {delay : 50});
    return emailWillBeEnteredPromise;
}).then(function(){
    let passwordWillBeEnteredPromise = page.type("#input-2", emailpassObj.password, {delay : 50});
    return passwordWillBeEnteredPromise;
}).then(function(){
    let LoginWillbeDonePromise = page.click('button[data-analytics="LoginPassword"]' , {delay : 100});
    return LoginWillbeDonePromise;
}).then(function(){
    
    let clickOnAlgoPromise = WaitAndClick(".topic-card a[data-attr1='algorithms']" , page);
    return clickOnAlgoPromise;
}).then(function(){
    let getToWarmUp = WaitAndClick("input[value='warmup']", page);
    return getToWarmUp;
}).then(function(){
    let waitFor3SecPromise = page.waitFor(3000);
    return waitFor3SecPromise;
}).then(function(){
    //list of question...

   let AllChallangesArrPromise =  page.$$(".ui-btn.ui-btn-normal.primary-cta.ui-btn-line-primary.ui-btn-styled",{delay: 100});
   return AllChallangesArrPromise;  

}).then(function(questionArr){
    console.log("number of question" , questionArr.length);
    let qWillBesolvedpromise = questionSolver(page , questionArr[0] ,answers[0]);
    return qWillBesolvedpromise;
}).then(function(){
    console.log("questionSolved");

})

function WaitAndClick(selector, cPage){
    return new Promise(function (resolve , reject){

       
            //cross ko cut karna
            let waitForModelPromise = 
            cPage.waitForSelector(selector,{visible: true});
             waitForModelPromise.then(function(){
        
            let clickModal = cPage.click(selector, {delay : 100});
            return clickModal;
            //to go in resource:-
        
        }).then(function(){
            resolve();
        }).catch(function(err){
            reject(err);
        })
    }
    )
}
//return a promise -> that will submit a given question
function questionSolver(page,question,answer){
    return new Promise(function(resolve ,reject){
     //click on question 
        let qWillBeClickedpromise = question.click();

        qWillBeClickedpromise.then(function() {
            //focus on editor
        let waitorEditorToBeInFocus = WaitAndClick(".monaco-editor.no-user-select.vs",page);
        return waitorEditorToBeInFocus;
        }).then(function() {
            let CtrlIsPressedP = page.keyboard.down("Control");
            return CtrlIsPressedP; 
         // work on monacoeditor:
        }).then(function() {
        
            let AIsPressedP = page.keyboard.press("A" , {delay : 100});
            return AIsPressedP;

        }).then(function() {

            return page.keyboard.press("X" , {delay : 100});
        }).then(function() {
            let CtrlIsPressedP = page.keyboard.up("Control");
            return CtrlIsPressedP;
        })
        //code typing:
        .then(function(){
            // fail due to autocomplete feature of vs code -> monaco-editor
            return page.keyboard.type(answer, {delay : 50});

        })
        
        
        
        .then(function(){
            resolve();
        }).catch(function(err){
            reject(err);
        })

    })

}
