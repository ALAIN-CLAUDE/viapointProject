import { LightningElement, track, api, wire } from 'lwc';
import getLogoPortal from '@salesforce/resourceUrl/LogoPortal';
import getNavigationMenuItems from '@salesforce/apex/NavigationGlobalMenuController.getNavigationMenuItems';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
import basePath from "@salesforce/community/basePath";

export default class FooterNavigation extends NavigationMixin(LightningElement) {
    @track logoImage = getLogoPortal;
    @api linkSetUserLabel = 'Footer Menu';
    @api addHomeMenuItem = false; 
    @api includeImageUrls = false;
    @track menuFooterItems =[];
    @track isLoaded = false;
    publishStatus;
    pageName;
    urlHome;
    urlOrganization;
    urlProducts;
    urlAssesments;
    urlSupport;

    @track url;

    connectedCallback() {
    this.urlHome = basePath;
    this.urlOrganization = basePath +'/organization';
    this.urlProducts = basePath +'/products';
    this.urlAssesments = basePath +'/assessments';
    this.urlSupport = basePath +'/support';
    } 

    @wire(getNavigationMenuItems, {
        navigationLinkSetMasterLabel: '$linkSetMasterLabel',
        publishStatus: '$publishStatus',
        addHomeMenuItem: '$addHomeMenuItem',
        includeImageUrl: '$includeImageUrls'
    })
    wiredFooterMenuItems({error, data}) {
        console.log('footer component', JSON.stringify(data) );
        if (data && !this.isLoaded) {
            this.menuFooterItems = data.map((item, index) => {
                console.log('footer item ', item);
                return {
                    target: item.actionValue,
                    id: index,
                    menuId:'menuId' + index,                    
                    label: item.label,
                    type: item.actionType,
                    subMenu: item.subMenu,
                    imageUrl: item.imageUrl,
                    windowName: item.target
                }
            });
            this.error = undefined;
            this.isLoaded = true;
            console.log('!!! footer menu', JSON.stringify(this.menuFooterItems) );
        } else if (error) {
            this.error = error;
            this.menuFooterItems = [];
            this.isLoaded = true;
        }
    }
    navigatePage(event){
        console.log('click link footer', event.target.value);
        console.log('basePath', basePath);
    }
   
    navigateToCommPage(pageName) {
        console.log('pageName', pageName);
        this[NavigationMixin.GenerateUrl]({
            type: 'comm__namedPage',
            attributes: {
                name: pageName
        }
        });
    }

    @wire(CurrentPageReference)
    setCurrentPageReference(currentPageReference) {
        this.pageName = currentPageReference;
        console.log('this.pageName ', this.pageName);
        const app = currentPageReference && currentPageReference.state && currentPageReference.state.app;
        if (app === 'commeditor') {
            this.publishStatus = 'Draft';
        } else {
            this.publishStatus = 'Live';
        }
    }


}