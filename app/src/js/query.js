(function(window){
  window.extractData = function() {
    var ret = $.Deferred();

    function onError() {
      console.log('Loading error', arguments);
      ret.reject();
    }

    function onReady(smart)  {
      if (smart.hasOwnProperty('patient')) {
        var patient = smart.patient;
        var pt = patient.read();
        var obv = smart.patient.api.fetchAll({
                    type: 'Observation',
                    query: {
                      code: {
                        $or: ['http://loinc.org|8867-4']
                      }
                    }
                  });

        $.when(pt, obv).fail(onError);

        $.when(pt, obv).done(function(patient, obv) {
          var byCodes = smart.byCodes(obv, 'code');
          // var gender = patient.gender;
          //
          // var fname = '';
          // var lname = '';
          //
          // if (typeof patient.name[0] !== 'undefined') {
          //   fname = patient.name[0].given.join(' ');
          //   lname = patient.name[0].family.join(' ');
          // }

          var heart_rate = byCodes('8867-4');
          // var weight = byCodes('29463-7');
          // var systolicbp = getBloodPressureValue(byCodes('55284-4'),'8480-6');
          // var diastolicbp = getBloodPressureValue(byCodes('55284-4'),'8462-4');
          // var hdl = byCodes('2085-9');
          // var ldl = byCodes('2089-1');

          var p = defaultPatient();
          // p.birthdate = patient.birthDate;
          // p.gender = gender;
          // p.fname = fname;
          // p.lname = lname;
          // p.height = getQuantityValueAndUnit(height[0]);
          // p.weight = getQuantityValueAndUnit(weight[0]);
          p.heart_rate = getQuantityValueAndUnit(heart_rate[0]);

          // if (typeof systolicbp != 'undefined')  {
          //   p.systolicbp = systolicbp;
          // }
          //
          // if (typeof diastolicbp != 'undefined') {
          //   p.diastolicbp = diastolicbp;
          // }
          //
          // p.hdl = getQuantityValueAndUnit(hdl[0]);
          // p.ldl = getQuantityValueAndUnit(ldl[0]);

          ret.resolve(p);
        });
      } else {
        onError();
      }
    }

    FHIR.oauth2.ready(onReady, onError);
    return ret.promise();

  };

  function defaultPatient(){
    return {
      // fname: {value: ''},
      // lname: {value: ''},
      // gender: {value: ''},
      // birthdate: {value: ''},
      // height: {value: ''},
      // weight: {value: ''},
      // systolicbp: {value: ''},
      // diastolicbp: {value: ''},
      // ldl: {value: ''},
      // hdl: {value: ''},
      heart_rate: {value: ''},
    };
  }

  function getQuantityValueAndUnit(ob) {
    if (typeof ob != 'undefined' &&
        typeof ob.valueQuantity != 'undefined' &&
        typeof ob.valueQuantity.value != 'undefined' &&
        typeof ob.valueQuantity.unit != 'undefined') {
          return ob.valueQuantity.value + ' ' + ob.valueQuantity.unit;
    } else {
      return undefined;
    }
  }

  window.drawVisualization = function(p) {
    $('#holder').show();
    $('#loading').hide();
    // $('#fname').html(p.fname);
    // $('#lname').html(p.lname);
    // $('#gender').html(p.gender);
    // $('#birthdate').html(p.birthdate);
    // $('#height').html(p.height);
    // $('#weight').html(p.weight);
    // $('#systolicbp').html(p.systolicbp);
    // $('#diastolicbp').html(p.diastolicbp);
    // $('#ldl').html(p.ldl);
    // $('#hdl').html(p.hdl);
    $('#heart_rate').html(p.heart_rate);
  };

})(window);
