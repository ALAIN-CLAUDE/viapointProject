import { LightningElement, api, wire, track } from 'lwc';
import getLoginURL from '@salesforce/apex/NavigationGlobalMenuController.getLoginURL';

export default class navigationGlobalMenu extends LightningElement {

menuList;
    menuItems = [
    {   Id: '0',
        Name: 'Home',
        pageUrl:'',
        isSubMenu:false
    },
    {
        Id: '1',
        Name: 'Organization',
        pageUrl:'',
        isSubMenu:true,
        submenuItem:[{
            Name:'Locations',
            pageUrl:'',
            Id:'sub-1'
        },{
            Name:'People',
            pageUrl:'',
            Id:'sub-2'
        }]
    },{
        Id: '2',
        Name: 'Products',
        pageUrl:'',
        isSubMenu: true,
        submenuItem:[
        {
            Name :'Purchased Products',
            pageUrl :'',
            Id :'sub-1'
        },{
            Name :'Available Products',
            pageUrl :'',
            Id :'sub-2'
        }]
    }, 
    {   Id : '3',
        Name : 'Assessments',
        pageUrl :'',
        isSubMenu : true,
        submenuItem :[
            {
                Name :'Audits',
                pageUrl :'',
                Id :'sub-1'
            },{
                Name :'Audit Activities',
                pageUrl :'',
                Id :'sub-2'
            },{
                Name:'Audit Resources',
                pageUrl:'',
                Id:'sub-3'
            },{
                Name:'Audit Activity Resources',
                pageUrl:'',
                Id:'sub-4'
            },{
                Name:'Audit Findings',
                pageUrl:'',
                Id:'sub-5'
            },{
                Name:'Corrective & Preventative Actions (CAPAs)',
                pageUrl:'',
                Id:'sub-6'
            }
        ]
    },{
        Id: '4',
        Name: 'Support',
        pageUrl:'',
        isSubMenu: true,
        submenuItem:[{
            Name:'Tickets',
            pageUrl:'',
            Id:'sub-1'
        }]
    },
];
   @track urlToView;

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

    handleSubMenu(event){
        let targetId = event.currentTarget.dataset.targetId;       
        let target = this.template.querySelector(`[data-id='${targetId}']`);        
        const classList = target.classList;
        classList.forEach(element => {
            if (element ==='slds-hide') {
               classList.remove('slds-hide');
               classList.add('slds-show');
            } else if (element === 'slds-show') {
                classList.add('slds-hide');
                classList.remove('slds-show');
             }
          })
    }

    connectedCallback() {
       // console.log("menuItem ", this.menuItems);
       // let getBaseUrl = this.getBaseUrl();
       // console.log("menuItem ", getBaseUrl);
    }

    getBaseUrl() {
        let baseUrl = 'https://'+location.host+'/';
        getLoginURL()
        .then(result => {
            console.log('result', result);
            baseUrl = result;
            window.console.log(baseUrl);
        })
        .catch(error => {
            console.log('Error: \n ', error);
        });
        return baseUrl;
    }

}