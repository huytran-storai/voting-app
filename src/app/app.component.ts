import { Component, OnInit  } from '@angular/core';
import { FakeApiService } from './services/fake-api.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor( private fakeApi: FakeApiService) {}  
   
  ngOnInit(): void {
    // this.fakeApi.getApi1().subscribe((res)=> {
    //   console.log("api 1 =====>", res);
    // })
  }
  
}
