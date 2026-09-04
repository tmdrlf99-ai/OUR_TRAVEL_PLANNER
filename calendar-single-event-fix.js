// OUR TRAVEL PLANNER - calendar single event display/save fix
// Fixes: one user schedule appearing as multiple rows because
// (1) multi-selected dates were saved as multiple event rows and
// (2) the automatically-created backing trip was rendered alongside the event.

(function(){
  function hideBackingAutoTrip(trip){
    if(!trip) return false;
    if(typeof isCalendarAutoTrip !== "function" || !isCalendarAutoTrip(trip)) return false;
    return events.some(ev => Number(ev.trip_id) === Number(trip.id));
  }

  // Right-side DAY PLAN / monthly list: show the actual schedule only once.
  if(typeof renderDay === "function"){
    renderDay = function(){
      let list=[];
      if(selectedDate){
        list=[
          ...events.filter(x=>eventOnDate(x,selectedDate)).map(x=>({id:x.id,kind:"event",badge:x.category||"일정",dateLabel:calendarRangeLabel(eventStartDate(x),eventEndDate(x)),title:x.title,sub:x.description||"",author:x.author_name||"",sortKey:eventStartDate(x)})),
          ...trips.filter(x=>tripOnDate(x,selectedDate) && !hideBackingAutoTrip(x)).map(x=>({id:x.id,kind:"trip",badge:x.start_date===selectedDate?"출발":x.end_date===selectedDate?"종료":"여행중",dateLabel:shortCalendarDate(selectedDate),title:x.title,sub:x.city||x.country||x.region||"",author:x.author_name||"",sortKey:x.start_date||selectedDate})),
          ...places.filter(x=>placeOnDate(x,selectedDate)).map(x=>({id:x.id,kind:"place",badge:x.status==="버킷리스트"?"방문계획":"방문지",dateLabel:shortCalendarDate(selectedDate),title:x.place_type==="국내"?domesticPlaceText(x):x.place_name,sub:x.memo||x.place_type||"",author:x.author_name||"",sortKey:x.start_date||selectedDate}))
        ];
        dayTitle.textContent=`${Number(selectedDate.slice(5,7))}월 ${Number(selectedDate.slice(8,10))}일 일정`;
        if(typeof monthOverviewBtn!=="undefined"&&monthOverviewBtn)monthOverviewBtn.hidden=false;
      }else{
        const y=cal.getFullYear(),m=cal.getMonth();
        const from=fmt(new Date(y,m,1)),to=fmt(new Date(y,m+1,0));
        list=[
          ...events.filter(x=>overlapsRange(eventStartDate(x),eventEndDate(x),from,to)).map(x=>({id:x.id,kind:"event",badge:x.category||"일정",dateLabel:calendarRangeLabel(eventStartDate(x),eventEndDate(x)),title:x.title,sub:x.description||"",author:x.author_name||"",sortKey:eventStartDate(x)})),
          ...trips.filter(x=>overlapsRange(x.start_date,x.end_date,from,to) && !hideBackingAutoTrip(x)).map(x=>({id:x.id,kind:"trip",badge:"여행",dateLabel:calendarRangeLabel(x.start_date,x.end_date),title:x.title,sub:x.city||x.country||x.region||"",author:x.author_name||"",sortKey:x.start_date||from})),
          ...places.filter(x=>overlapsRange(x.start_date,x.end_date,from,to)).map(x=>({id:x.id,kind:"place",badge:x.status==="버킷리스트"?"방문계획":"방문지",dateLabel:calendarRangeLabel(x.start_date,x.end_date),title:x.place_type==="국내"?domesticPlaceText(x):x.place_name,sub:x.memo||x.place_type||"",author:x.author_name||"",sortKey:x.start_date||from}))
        ];
        dayTitle.textContent=`${m+1}월 전체 일정`;
        if(typeof monthOverviewBtn!=="undefined"&&monthOverviewBtn)monthOverviewBtn.hidden=true;
      }
      list.sort((a,b)=>(a.sortKey||"").localeCompare(b.sortKey||"")||a.title.localeCompare(b.title,"ko"));
      dayCount.textContent=`${list.length}건`;
      dayEvents.innerHTML=list.length?list.map(x=>`<div class="day-event" data-kind="${x.kind}" data-id="${x.id}"><time title="${esc(x.badge)}"><b>${esc(x.dateLabel)}</b><small>${esc(x.badge)}</small></time><div><strong>${esc(x.title)}</strong><small>${esc(x.sub)}${x.author?` · 작성 ${esc(x.author)}`:""}</small></div></div>`).join(""):`<div class="empty">${selectedDate?"선택한 날짜에 등록된 일정이 없습니다.":"이 달에 등록된 여행 일정이 없습니다."}</div>`;
      $$("#dayEvents .day-event").forEach(el=>el.onclick=()=>{
        const id=Number(el.dataset.id);
        if(el.dataset.kind==="event")editEvent(id);
        else if(el.dataset.kind==="place")editPlace(id);
        else editTrip(id);
      });
    };
  }

  // Save one schedule as one event row, even when the calendar date range spans multiple days.
  if(typeof eventFormPublic !== "undefined" && eventFormPublic){
    eventFormPublic.onsubmit=async e=>{
      e.preventDefault();clearFormError("eventFormPublic");
      const existing=eventEditId.value;
      const id=existing?Number(existing):null;
      const oldEvent=id?events.find(v=>Number(v.id)===id):null;
      let tripId=eventTripEdit.value?Number(eventTripEdit.value):null;
      const picked=!existing?selectedCalendarDates():[];
      const usePicked=!existing&&picked.length>1;
      const startDate=usePicked?picked[0]:eventDateEdit.value;
      const endDate=usePicked?picked.at(-1):(eventEndDateEdit.value||startDate);
      if(endDate<startDate){showFormError("eventFormPublic","마지막 복귀 일자는 시작 일자보다 빠를 수 없습니다.");return;}
      const targetDates=calendarDateSequence(startDate,endDate);
      const basePayload={
        trip_id:tripId,
        category:eventCategoryEdit.value.trim()||"일정",
        title:eventTitleEdit.value.trim(),
        description:eventDescEdit.value.trim(),
        author_name:eventAuthorEdit.value.trim(),
        is_visible:true,
        updated_at:new Date().toISOString()
      };
      try{
        if(!tripId){
          const autoTrip=await createCalendarAutoTrip(targetDates,basePayload);
          tripId=Number(autoTrip.id);
          basePayload.trip_id=tripId;
          eventTripEdit.value=String(tripId);
        }else{
          const linkedTrip=trips.find(t=>Number(t.id)===Number(tripId));
          if(linkedTrip&&isCalendarAutoTrip(linkedTrip)){
            await updateCalendarAutoTrip(linkedTrip,targetDates,basePayload);
          }
        }

        const p={...basePayload,trip_id:tripId,event_date:startDate,start_date:startDate,end_date:endDate};
        if(id&&id>0){
          const previousTripId=oldEvent?.trip_id?Number(oldEvent.trip_id):null;
          const saved=await apiData("travel_events","PUT",p,id);
          localDelete("events",id);if(saved)localUpsert("events",saved);
          await syncCalendarEventToTravelRecords(tripId,targetDates,p);
          if(previousTripId&&previousTripId!==tripId)await deleteCalendarAutoTripIfUnused(previousTripId,id);
        }else{
          const saved=await apiData("travel_events","POST",p);
          if(saved)localUpsert("events",saved);
          await syncCalendarEventToTravelRecords(tripId,targetDates,p);
        }

        selectedDates.clear();selectedDates.add(startDate);selectedDate=startDate;lastCalendarAnchor=startDate;
        closeModal("eventModal");
        toast(existing?"일정이 수정되었습니다.":"일정이 등록되었습니다.");
        await loadAll();
      }catch(err){showFormError("eventFormPublic",err)}
    };
  }
})();
