(function(win){
    let input_fields = {
        "nm_init_import": 0,
        "nm_init_export": 0,
        "nm_final_import": 0,
        "nm_final_export": 0,
        "solar_init": 0,
        "solar_final": 0
    }

    let output_fields = {
        "solar_generation": 0,
        "solar_energy_export": 0,
        "solar_direct_consumption": 0,
        "kseb_energy_import": 0,
        "total_energy_consumed_by_consumer": 0,
        "self_generation_charge": 0,
        "billed_unit": 0
    }

    function handleNan(value){
        return (isNaN(value) || (value < 0))? 0 : value;
    }

    function calculateValues(input_values, output) {
        let solar_generation = input_values["solar_final"] - input_values["solar_init"];
        output["solar_generation"] = handleNan(solar_generation);
        
        let solar_energy_export = input_values["nm_final_export"] - input_values["nm_init_export"]
        output["solar_energy_export"] = handleNan(solar_energy_export);
        
        let solar_direct_consumption = solar_generation - solar_energy_export;
        output["solar_direct_consumption"] = handleNan(solar_direct_consumption);
        
        let kseb_energy_import = input_values["nm_final_import"] - input_values["nm_init_import"];
        output["kseb_energy_import"] = handleNan(kseb_energy_import);
        
        let total_energy_consumed_by_consumer = solar_direct_consumption + kseb_energy_import;
        output["total_energy_consumed_by_consumer"] = handleNan(total_energy_consumed_by_consumer);
        
        let self_generation_charge = parseFloat(solar_generation) * (1.2/100);
        output["self_generation_charge"] = handleNan(self_generation_charge);
        
        let billed_unit = kseb_energy_import - solar_energy_export
        output["billed_unit"] = handleNan(billed_unit)
        
        return {...output}
    }

    function renderValues(output) {
        let outputLabels = document.querySelectorAll("label[id]");
        for(let index=0;index<outputLabels.length; index++){
            let item = outputLabels[index]
            if(output.hasOwnProperty(item.id)){
                item.innerHTML = output[item.id]
            }
        }
    }

    win.onChangeField = (event) => {
        let meter_key = event.target.id;
        let meter_value = parseInt(event.target.value);

        input_fields[meter_key] = meter_value;
        let caculatedOutput = calculateValues({...input_fields}, {...output_fields})
        renderValues(caculatedOutput);
    }
})(window)