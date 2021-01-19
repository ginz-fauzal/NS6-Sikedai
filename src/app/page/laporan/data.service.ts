import { Injectable } from '@angular/core'; 
import { Charts } from './charts';

@Injectable()
export class DataService {
    
    getLineSource(data): Charts[] {
        for(var i in data){
            data[i].Cost=Number(data[i].Cost);
            data[i].Cost2=Number(data[i].Cost2);
        }
        return data;
        
    }
}