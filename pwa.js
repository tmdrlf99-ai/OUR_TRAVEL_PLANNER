(()=>{
  let deferredPrompt=null;
  const installBtn=document.getElementById("installPwaBtn");
  const ua=navigator.userAgent||"";
  const isIOS=/iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  const isStandalone=()=>window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone===true;

  function notify(message){
    if(typeof window.toast==="function") window.toast(message);
    else alert(message);
  }

  function refreshInstallButton(){
    if(!installBtn)return;
    if(isStandalone()){
      installBtn.hidden=true;
      return;
    }
    installBtn.hidden=!(deferredPrompt || isIOS);
  }

  if("serviceWorker" in navigator){
    window.addEventListener("load",()=>{
      navigator.serviceWorker.register("/sw.js",{scope:"/"})
        .catch(err=>console.warn("PWA service worker registration failed",err));
    });
  }

  window.addEventListener("beforeinstallprompt",event=>{
    event.preventDefault();
    deferredPrompt=event;
    refreshInstallButton();
  });

  window.addEventListener("appinstalled",()=>{
    deferredPrompt=null;
    refreshInstallButton();
    notify("OUR TRAVEL PLANNER 앱이 설치되었습니다.");
  });

  installBtn?.addEventListener("click",async()=>{
    if(isStandalone()){
      installBtn.hidden=true;
      return;
    }

    if(deferredPrompt){
      deferredPrompt.prompt();
      try{
        await deferredPrompt.userChoice;
      }catch(_){}
      deferredPrompt=null;
      refreshInstallButton();
      return;
    }

    if(isIOS){
      notify("Safari의 공유 버튼 → '홈 화면에 추가'를 선택해 주세요.");
      return;
    }

    notify("브라우저 메뉴에서 '앱 설치' 또는 '홈 화면에 추가'를 선택해 주세요.");
  });

  window.matchMedia("(display-mode: standalone)")?.addEventListener?.("change",refreshInstallButton);
  refreshInstallButton();
})();