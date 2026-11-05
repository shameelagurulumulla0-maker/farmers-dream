// Behavior tests use a simulated DOM. They do not replace native/browser UI testing.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const elements=new Map();
function element(key){
  if(!elements.has(key))elements.set(key,{value:['#sort','#member-sort'].includes(key)?'new':key==='#member-price-basis'?'kg':'',innerHTML:'',textContent:'',hidden:false,style:{},dataset:{},classList:{toggle(){},remove(){}},querySelectorAll(){return [];},insertAdjacentHTML(){},addEventListener(){},setAttribute(){},close(){this.open=false;},showModal(){this.open=true;}});
  return elements.get(key);
}
const location={hash:'#/'};
let serial=0,failStorage=false;
const context=vm.createContext({
  window:{addEventListener(){},scrollTo(){}},
  document:{body:{classList:{toggle(){},remove(){}}},querySelector:element,querySelectorAll:()=>[],addEventListener(){}},
  location,URLSearchParams,
  history:{pushState(a,b,url){location.hash=url;},replaceState(a,b,url){location.hash=url;}},
  localStorage:{getItem:()=>null,setItem(){if(failStorage)throw Error('Storage full');}},
  crypto:{randomUUID:()=>`test-${++serial}`},setTimeout,clearTimeout,
  FormData:class {constructor(form){return new Map(Object.entries(form.values||{}));}}
});
for(const file of ['app.js','community.js','directory.js'])vm.runInContext(await fs.readFile(root+'dist/'+file,'utf8'),context,{filename:file});
const run=code=>vm.runInContext(code,context);
const json=code=>JSON.parse(JSON.stringify(run(code)));
assert.equal(run('districts.length'),25);
assert.equal(run('new Set(districts).size'),25);
assert.deepEqual(json('districts'),['Ampara','Anuradhapura','Badulla','Batticaloa','Colombo','Galle','Gampaha','Hambantota','Jaffna','Kalutara','Kandy','Kegalle','Kilinochchi','Kurunegala','Mannar','Matale','Matara','Monaragala','Mullaitivu','Nuwara Eliya','Polonnaruwa','Puttalam','Ratnapura','Trincomalee','Vavuniya']);
run("profiles=Array.from({length:14},(_,i)=>({id:'f'+i,name:'Farmer '+i,role:'Farmer',district:i%2?'Kandy':'Colombo',createdAt:new Date(1700000000000+i*1000).toISOString()}));profiles.push({id:'customer',name:'Buyer',role:'Wholesale buyer',district:'Kandy'},{id:'other',name:'Other buyer',role:'Wholesale buyer',district:'Kandy'});");
context.window.openSection('produce');
assert.equal((element('#member-grid').innerHTML.match(/class="card member-card"/g)||[]).length,6);
assert.match(element('#member-pagination').innerHTML,/data-member-page="3"/);
assert.match(element('#member-grid').innerHTML,/Farmer 13/);
assert.doesNotMatch(element('#member-grid').innerHTML,/>Buyer</);
run('setDirectoryPage(3)');
assert.equal(location.hash,'#/produce?page=3');
assert.equal((element('#member-grid').innerHTML.match(/class="card member-card"/g)||[]).length,2);
element('#member-district').value='Kandy';run('resetDirectoryPage()');
assert.equal(run('directoryPage'),1);
assert.equal(element('#member-count').textContent,'7 registered members');
assert.doesNotMatch(element('#member-pagination').innerHTML,/data-member-page="3"/);
element('#member-district').value='';element('#member-search').value='missing';run('resetDirectoryPage()');
assert.equal(element('#member-empty').hidden,false);
element('#member-search').value='';
run("state.listings=[{id:'l1',profileId:'f2',wholesale:true,category:'produce',intent:'offer',priceAmount:10,priceBasis:'kg',title:'Rice',owner:'Farmer 2',district:'Colombo',price:'LKR 10/kg',description:'Rice'},{id:'l2',profileId:'f8',wholesale:true,category:'produce',intent:'offer',priceAmount:300,priceBasis:'kg',title:'Carrots',owner:'Farmer 8',district:'Colombo',price:'LKR 300/kg',description:'Carrots'},{id:'l3',profileId:'f1',wholesale:true,category:'produce',intent:'offer',priceAmount:2,priceBasis:'bag',title:'Compost',owner:'Farmer 1',district:'Kandy',price:'LKR 2/bag',description:'Compost'}];");
assert.equal(run("memberSort(directoryMembers('produce'),'price-asc','kg')[0].id"),'f2');
assert.equal(run("memberSort(directoryMembers('produce'),'price-desc','kg')[0].id"),'f8');
assert.equal(run("memberSort(directoryMembers('produce'),'price-asc','bag')[0].id"),'f1');
assert.equal(run("memberPrice('f1','kg')"),null);
context.input={reference:'ORDER-1',description:'Received wholesale rice delivery'};
assert.equal(run("requestCompletion('f2',input).ok"),false);
run("currentProfileId='f2'");assert.equal(run("requestCompletion('f2',input).ok"),false);
run("currentProfileId='customer'");assert.equal(run("requestCompletion('f2',input).ok"),true);
const transaction=run('state.transactions[0].id');context.transaction=transaction;
assert.equal(run("requestCompletion('f2',input).ok"),false);
assert.equal(run("submitCustomerReview(transaction,{stars:5,comment:'Excellent delivery and quality.'}).ok"),false);
assert.equal(run('confirmCompletion(transaction).ok'),false);
run("currentProfileId='f3'");assert.equal(run('confirmCompletion(transaction).ok'),false);
run("currentProfileId='f2'");assert.equal(run('confirmCompletion(transaction).ok'),true);
assert.equal(run("submitCustomerReview(transaction,{stars:5,comment:'Self review attempt.'}).ok"),false);
run("currentProfileId='other'");assert.equal(run("submitCustomerReview(transaction,{stars:5,comment:'Not my transaction.'}).ok"),false);
run("currentProfileId='customer'");
assert.equal(run("submitCustomerReview(transaction,{stars:6,comment:'Invalid rating value.'}).ok"),false);
assert.equal(run("submitCustomerReview(transaction,{stars:5,comment:'short'}).ok"),false);
assert.equal(run("submitCustomerReview(transaction,{stars:5,comment:'Excellent delivery <script>alert(1)</script>'}).ok"),true);
assert.equal(run("submitCustomerReview(transaction,{stars:1,comment:'Duplicate review attempt.'}).ok"),false);
assert.equal(run("memberRating('f2').average"),5);
assert.equal(run("memberSort(directoryMembers('produce'),'rating')[0].id"),'f2');
run("showMember('f2')");assert.match(element('#member-detail').innerHTML,/&lt;script&gt;/);
assert.doesNotMatch(element('#member-detail').innerHTML,/<script>/);
run("state.reviews.push({providerId:'f3',customerId:'other',stars:5,transactionId:'fake'})");
assert.equal(run("memberRating('f3').count"),0);
const previous=run('state.transactions.length');context.input.reference='ORDER-2';failStorage=true;
assert.equal(run("requestCompletion('f2',input).ok"),false);
assert.equal(run('state.transactions.length'),previous);assert.match(run("requestCompletion('f2',input).message"),/could not be saved/);failStorage=false;
location.hash='#/produce?page=2';run('applySectionRoute()');assert.equal(run('directoryPage'),2);
console.log('Passed: 25 districts, member paging/filtering, newest/price/rating sorting, unit-consistent prices, completed-transaction review eligibility, role restrictions, duplicate prevention, escaped review text, persistence rollback and page restoration.');
