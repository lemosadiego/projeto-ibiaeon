import { NgModule } from '@angular/core';
import { PopoverComponent } from './popover/popover';
import { TestComponent } from './test/test';
import { ExpandableComponent } from './expandable/expandable';
@NgModule({
	declarations: [PopoverComponent,
    TestComponent,
    ExpandableComponent],
	imports: [],
	exports: [PopoverComponent,
    TestComponent,
    ExpandableComponent]
})
export class ComponentsModule {}
