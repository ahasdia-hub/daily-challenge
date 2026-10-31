/* The Daily Challenge — Firebase storage adapter.
   Gives the page the same small db API it used inside Claude (doc().set/delete/onSnapshot, collection().onSnapshot). */
(function(){
  var SEED = {
    'config/app': {"admin":{"pinHash":"b707c445","pinLength":6},"kids":{"aya":{"code":"4817","color":"#FF7AB6","grade":7,"lang":"he","name":"Aya","order":1},"yousef":{"code":"3952","color":"#3CDDE0","grade":4,"lang":"ar","name":"Yousef","order":2}},"rules":{"lateDays":2,"lateMult":0.5,"maxPoints":10,"veryLateMult":0.25},"schema":1,"timezone":"Asia/Jerusalem"},
    'profiles/aya': {"avatar":"photo","photo":"avatar-aya.jpg"},
    'profiles/yousef': {"avatar":"photo","photo":"avatar-yousef.jpg"}
  };
  // Firestore can't store an array directly inside an array (e.g. match pairs), so inner arrays are wrapped.
  function enc(v){
    if (Array.isArray(v)) return v.map(function(x){ return Array.isArray(x) ? {_arr_: enc(x)} : enc(x); });
    if (v && typeof v === 'object'){ var o = {}; Object.keys(v).forEach(function(k){ if (v[k] !== undefined) o[k] = enc(v[k]); }); return o; }
    return v;
  }
  function dec(v){
    if (Array.isArray(v)) return v.map(dec);
    if (v && typeof v === 'object'){
      var ks = Object.keys(v); if (ks.length === 1 && ks[0] === '_arr_' && Array.isArray(v._arr_)) return dec(v._arr_);
      var o = {}; ks.forEach(function(k){ o[k] = dec(v[k]); }); return o;
    }
    return v;
  }
  function api(fs){
    function docRef(path){
      var r = fs.doc(path);
      return {
        set: function(d){ return r.set(enc(d)); },
        delete: function(){ return r.delete(); },
        get: function(){ return r.get().then(function(s){ return {exists:s.exists, id:s.id, data:function(){ return dec(s.data()); }}; }); },
        onSnapshot: function(cb, err){ return r.onSnapshot({includeMetadataChanges:true}, function(s){ cb({exists:s.exists, id:s.id, metadata:s.metadata, data:function(){ return dec(s.data()); }}); }, err); }
      };
    }
    function colRef(path){
      var r = fs.collection(path);
      return {
        doc: function(id){ return docRef(path + '/' + id); },
        onSnapshot: function(cb, err){ return r.onSnapshot(function(qs){ cb({metadata:qs.metadata, docs:qs.docs.map(function(d){ return {id:d.id, exists:true, data:function(){ return dec(d.data()); }}; })}); }, err); }
      };
    }
    return Object.freeze({doc:docRef, collection:colRef});
  }
  function seed(fs){
    return fs.doc('config/app').get().then(function(s){
      if (s.exists) return;
      return Promise.all(Object.keys(SEED).map(function(p){ return fs.doc(p).set(SEED[p]); }));
    });
  }
  var ready = null;
  function start(){
    var cfg = window.TDC_FIREBASE;
    if (!window.firebase || !cfg || !cfg.apiKey || /PASTE/.test(cfg.apiKey)){ console.error('Daily Challenge: Firebase is not configured (firebase-config.js).'); return Promise.resolve(null); }
    try {
      if (!firebase.apps.length) firebase.initializeApp(cfg);
      var fs = firebase.firestore();
      try { fs.settings({ignoreUndefinedProperties:true, merge:true}); } catch(e){}
      try { fs.enablePersistence({synchronizeTabs:true}).catch(function(){}); } catch(e){}
      return firebase.auth().signInAnonymously()
        .then(function(){ return seed(fs); })
        .then(function(){ return api(fs); })
        .catch(function(e){ console.error('Daily Challenge: database error', e); return null; });
    } catch(e){ console.error(e); return Promise.resolve(null); }
  }
  window.claude = {use: function(name){ if (name !== 'db') return Promise.resolve(null); return ready || (ready = start()); }};
})();
