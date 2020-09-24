import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ChurchapiService } from './churchapi.service';

export const loginResponse = {"data":{"status":"success","message":"login.success","personId":1,"location":"?=churchhome"}};

export const getCal2Response = {"status":"success","data":{"2":{"1":{"id":"1","bezeichnung":"Gottesdienst","intern_yn":"0","startdate":"2020-07-12 11:00:00","enddate":"2020-07-12 12:30:00","old_category_id":"0","category_id":"2","repeat_id":"0","repeat_frequence":null,"repeat_until":null,"repeat_option_id":null,"attachments":null,"modified_date":"2020-07-08 14:56:27","modified_pid":"1","create_date":"2020-07-08 14:56:27","create_pid":"1","version":"0","event_id":"1","event_startdate":"2020-07-12 11:00:00","event_template_id":null,"bookings":{"1":{"id":"1","minpre":30,"minpost":30,"resource_id":"3","status_id":"2","location":"","note":""}},"csevents":{"1":{"id":"1","startdate":"2020-07-12 11:00:00","service_texts":[],"eventTemplate":null}}},"3":{"id":"3","bezeichnung":"test","intern_yn":"0","startdate":"2020-07-29 10:00:00","enddate":"2020-07-29 11:00:00","old_category_id":"0","category_id":"2","repeat_id":"0","repeat_frequence":null,"repeat_until":null,"repeat_option_id":null,"attachments":null,"modified_date":"2020-07-28 12:58:34","modified_pid":"1","create_date":"2020-07-28 12:58:34","create_pid":"1","version":"0","event_id":null,"event_startdate":null,"event_template_id":null,"booking_id":null,"booking_startdate":null,"booking_enddate":null,"booking_resource_id":null,"booking_status_id":null,"booking_location":null,"booking_note":null}}}}

describe('ChurchapiService', () => {
  let service: ChurchapiService;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChurchapiService],
      imports: [ HttpClientTestingModule ]
    });
    
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(ChurchapiService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

//  {"data":{"status":"success","message":"login.success","personId":1,"location":"?=churchhome"}}

  it('should receive loginResponse',()=>{

    service.login('admin','admin').subscribe((resp)=>{
      expect(resp).not.toBe(null);
      expect(JSON.stringify(resp)).toEqual(JSON.stringify(loginResponse))
    });

    const req = httpTestingController
              .expectOne(`http://ec2-18-184-42-189.eu-central-1.compute.amazonaws.com/api/login?username=admin&password=admin`);

    req.flush(loginResponse);
    
  });

  it('should receive loginResponse',()=>{

    service.getCalendarEventsByCategory('2').subscribe((resp)=>{
      expect(resp).not.toBe(null);
      expect(JSON.stringify(resp)).toEqual(JSON.stringify(getCal2Response))
    });

    const req = httpTestingController
              .expectOne(`http://ec2-18-184-42-189.eu-central-1.compute.amazonaws.com/index.php?q=churchcal/ajax&func=getCalPerCategory&category_ids[]=2`);

    req.flush(getCal2Response);
    
  });
});
