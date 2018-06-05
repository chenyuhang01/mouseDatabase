import {
    ComponentFactoryResolver,
    Injectable,
    Inject,
    ReflectiveInjector
} from '@angular/core'
import { EditMouseView } from '../../components/editmouseview/editmouseview.component';
@Injectable()
export class DynamicLoader {


    private rootViewContainer;

    constructor(public factoryResolver: ComponentFactoryResolver) { }

    setRootViewContainerRef(viewContainerRef) {
        this.rootViewContainer = viewContainerRef
    }

    addeditmouseview() {
        //console.log(this.rootViewContainer);
        const factory = this.factoryResolver
            .resolveComponentFactory(EditMouseView)
        const component = factory
            .create(this.rootViewContainer.parentInjector)
        console.log(component);
        this.rootViewContainer.insert(component.hostView)
    }
}