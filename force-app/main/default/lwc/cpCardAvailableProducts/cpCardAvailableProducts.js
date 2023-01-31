import { LightningElement,wire,track, api} from 'lwc';
import { refreshApex } from "@salesforce/apex";
import getOrgProducts from '@salesforce/apex/cpCardAvailableProducts.getOrgProducts';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import FAMILY_FIELD from '@salesforce/schema/Product2.Family';
import basePath from "@salesforce/community/basePath";


export default class CpCardAvailableProducts extends LightningElement {
    @track productData;
    @track countProducts;
    objectApiName='Product2';
    urlAvailableProducts = basePath +'/products/available-products';
    default=basePath +"/sfc/servlet.shepherd/version/download/";
    familyStatus;
    filterDataResults;
    filteredData = false;
    @track sortDirection;
    @track filterValuesStatus=[];
    @track filterValueFamily=[];
    @track filterValueProductName;
    filteredDataValues={};

    @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: FAMILY_FIELD })
    wiredValues({ error, data }) {
        if (data) {
            console.log('datafamilyStatus', data);
            this.familyStatus = data.values;
            this.error = undefined;
            console.log('datafamilyStatus ', this.familyStatus);
        } else {
            this.error = error;
            this.familyStatus = undefined;
        }
    }
    
    @wire(getOrgProducts)
    cons(result) {
        refreshApex(result);
        if (result.data) {
            this.productData = result.data;
            let resp  = JSON.parse(JSON.stringify(result.data))
            //console.log('this is the audit data'+JSON.stringify(result));         
            resp.forEach(item => {
                item['editLink'] = '/product/' +item['Id'];
                console.log('if true', item['IsActive'] );
                item['status'] = item['IsActive'] ? 'Active' : 'Inactive';               
                item['unitClass'] = item['IsActive'] ?'card-box active':'card-box inactive';
                item['menuId'] = 'menuId'+item['Id'];
                if(item['ProductCardImage__c']){
                    item['ImageStyle'] = item['ProductCardImage__c'] +'#toolbar=0';
                }              
                
                item['imageLogoCss'] = 'background-color:' + item['ProductCardBackgroundColor__c'];
                
            });
            this.productData = resp;
            this.countProducts = resp.length;
        }
        if (result.error) {
            this.productData = undefined;
        }
    };
    showDropDown(event){
        let targetId = event.target.dataset.targetId;
        let targetLi = this.template.querySelector(`[ data-target-id="${targetId}"]`); 
        let target = this.template.querySelector(`[data-id="${targetId}"]`);
        let targetClasses = targetLi.classList;
        console.log('targetClasses', targetClasses);
        if(!targetClasses.contains("show-dropdown")) {
            target.classList.add("show-dropdown");
            targetLi.classList.add("show-bg");
        }  
        if(targetClasses.contains("show-dropdown")) {
            target.classList.remove("show-dropdown");
            targetLi.classList.remove("show-bg");
        }
    }
    filterStatus(event) {
        let filterValue = event.target.dataset.filter;
        
        let targetId = event.target.dataset.targetId; 
        let targetLi = this.template.querySelector(`[ data-target-id="${targetId}"]`); 
        let target = this.template.querySelector(`[data-id="${targetId}"]`);
        let targetClasses = target.classList;
        console.log('C targetClasses', targetClasses);
        let targetClassesLi = targetLi.classList;
        console.log('C targetClassesLi', targetClassesLi);
        let filterValues =[];
        console.log('C filterValue', filterValue);
        if(targetClasses.contains("hide-icon") && targetClassesLi.contains("hidden")) {
            console.log('C hidden');
            targetLi.classList.remove("hidden");
            target.classList.remove("hide-icon");
            targetLi.classList.toggle("show");
            target.classList.toggle("show-icon");
            if( !this.filterValuesStatus.includes(filterValue)){
                this.filterValuesStatus.push(filterValue);
            }
           
            console.log('C filterValue added', this.filterValuesStatus);
          
        }  
        else if(targetClasses.contains("show-icon") && targetClassesLi.contains("show")) {
            console.log('C show');
            targetLi.classList.remove("show");
            target.classList.remove("show-icon");
            target.classList.toggle("hide-icon");
            targetLi.classList.toggle("hidden");
            if(this.filterValuesStatus.includes(filterValue)){
                this.filterValuesStatus = this.filterValuesStatus.filter(value => value !==filterValue);
            }
        }
        console.log('C null',  this.filterValuesStatus);
        
        console.log('filter ', event.target.dataset.filter);
        console.log('C ', this.filterValuesStatus);
        this.filteredData = true;
        this.filterCards('status');
       
    }
    filterFamily(event) {
        let filterValue = event.target.dataset.filter;
        let targetId = event.target.dataset.targetId; 
        let targetLi = this.template.querySelector(`[ data-target-id="${targetId}"]`); 
        let target = this.template.querySelector(`[data-id="${targetId}"]`);
        let targetClasses = target.classList;
        let targetClassesLi = targetLi.classList;

         if(targetClasses.contains("hide-icon") && targetClassesLi.contains("hidden")) {
            console.log('C hidden');
            targetLi.classList.remove("hidden");
            target.classList.remove("hide-icon");
            targetLi.classList.toggle("show");
            target.classList.toggle("show-icon");
            if( !this.filterValueFamily.includes(filterValue)){
                this.filterValueFamily.push(filterValue);
            }
           
            console.log('C filterValue added', this.filterValuesStatus);
          
        }  
        else if(targetClasses.contains("show-icon") && targetClassesLi.contains("show")) {
            console.log('C show');
            targetLi.classList.remove("show");
            target.classList.remove("show-icon");
            target.classList.toggle("hide-icon");
            targetLi.classList.toggle("hidden");
            if(this.filterValueFamily.includes(filterValue)){
                this.filterValueFamily = this.filterValueFamily.filter(value => value !==filterValue);
            }
        }
        this.filteredData = true;
        this.filterCards('family');
        console.log('filter ', this.filterValueFamily);
    }
    notFilteredData(event){
        this.filteredData = false;
        this.familyStatus.forEach(record => {
            let targetLi = this.template.querySelector(`[ data-target-id="${record.value}"]`); 
            let target = this.template.querySelector(`[data-id="${record.value}"]`);
            let targetInput = this.template.querySelector(`[data-id="search-id"]`);
           //targetInput.value='';
            target.classList.remove("show");
            targetLi.classList.remove("show");
        }
        );
        
        console.log(' this.filteredData',  this.filteredData);
        this.filterDataResults=[];
        refreshApex( this.productData);
    }

    filterCards(filterField) {
       // console.log('filterValues in filterCards ', typeof filterValues);
       // console.log('filterValues in filterCards ', JSON.stringify(filterValues));
        
        let filteredResults = [];
        this.productData.forEach(record => {
            if(filterField ==='status') {
                if (this.filterValuesStatus.includes(record.status)) {
                    console.log('filteredProducts Status', record);
                    filteredResults.push(record);      
            }
            }
            if(filterField ==='family'){
                if (this.filterValueFamily.includes(record.Family)) {
                    console.log('filteredProducts Family', record);
                    filteredResults.push(record);   
            }
            }
            if(filterField ==='productName'){
                console.log('record.Name', record.Name);
                let productName = record.Name.toLowerCase();
                if (productName.includes(this.filterValueProductName)) {
                    console.log('HAS includes');
                    console.log('filteredProducts productName', record);
                    filteredResults.push(record);     
            }
            }
            
            console.log('filteredResults ', JSON.stringify(filteredResults));
           
        });
        this.filterDataResults = filteredResults;
        this.countProducts = filteredResults.length;
    }

    searchFunction(event){       
        let targetId = event.target.dataset.targetId; 
        console.log('targetId ', targetId);
        console.log('targetId value', event.target.value);
        let inputValue = event.target.value;
        this.filteredData = true;
        let filterValues =[];
        this.filterValueProductName = inputValue.toLowerCase();
        this.filterCards( this.filterValueProductName, 'productName');
        
    }

    handleMouseover(event) {
        let targetId = event.target.dataset.targetId;       
        let target = this.template.querySelector(`[data-id="${targetId}"]`);        
        target.classList.remove('slds-hide');
        target.classList.add('slds-show');

    }
    
    handleMouseLeave(event) {
        const targetId = event.target.dataset.targetId;        
        const target = this.template.querySelector(`[data-id="${targetId}"]`);      
        target.classList.add('slds-hide');
        target.classList.remove('slds-show');
    }
    handleSortData(event) {       
        this.sortBy = event.detail.fieldName;       
        this.sortDirection = event.detail.sortDirection;       
        this.sortData(event.detail.fieldName, event.detail.sortDirection);
    }

    sortData(event) {
        let fieldname = Name;
        let parseData = JSON.parse(JSON.stringify( this.productData));
       
        let keyValue = (a) => {
            return a[fieldname];
        };


       let isReverse = direction === 'asc' ? 1: -1;


           parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; 
            y = keyValue(y) ? keyValue(y) : '';
           
            return isReverse * ((x > y) - (y > x));
        }); 
        this.records = parseData;
    }

}