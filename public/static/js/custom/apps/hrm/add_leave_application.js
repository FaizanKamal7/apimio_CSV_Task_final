// Define form element
const addLeaveApplicationForm = document.getElementById('re_add_leave_application_form');

// Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
var addLeaveApplicationValidator = FormValidation.formValidation(
    addLeaveApplicationForm,
    {
        fields: {
            'employee_id': {
                validators: {
                    notEmpty: {
                        message: 'Employee is required'
                    }
                }
            },
            'leave_type_id': {
                validators: {
                    notEmpty: {
                        message: 'Leave type is required'
                    }
                }
            },
            'duration': {
                validators: {
                    notEmpty: {
                        message: 'Duration is required'
                    }
                }
            },

            'start_date': {
                validators: {
                    notEmpty: {
                        message: 'Start date is required'
                    }
                }
            },
            'end_date': {
                validators: {
                    notEmpty: {
                        message: 'End date is required'
                    }
                }
            },
            'impact_on_pay': {
                validators: {
                    notEmpty: {
                        message: 'Impact on pay is required'
                    }
                }
            },

        },

        plugins: {
            trigger: new FormValidation.plugins.Trigger(),
            bootstrap: new FormValidation.plugins.Bootstrap5({
                rowSelector: '.fv-row',
                eleInvalidClass: '',
                eleValidClass: ''
            })
        }
    }
);

$("#employee_id").change(function() {
    // Revalidate the field when an option is chosen
    addLeaveApplicationValidator.revalidateField('employee_id');
});

$("#leave_type_id").change(function() {
    // Revalidate the field when an option is chosen
    addLeaveApplicationValidator.revalidateField('leave_type_id');
});

$("#duration").change(function() {
    // Revalidate the field when an option is chosen
    addLeaveApplicationValidator.revalidateField('duration');
});

// Submit button handler
const LeaveApplicationSubmitButton = document.getElementById('re_add_leave_application_submit');
LeaveApplicationSubmitButton.addEventListener('click', function (e) {
    // Prevent default button action
    e.preventDefault();

    // Validate form before submit
    if (addLeaveApplicationValidator) {
        addLeaveApplicationValidator.validate().then(function (status) {
            console.log('validated!');

            if (status == 'Valid') {
                // Show loading indication
                LeaveApplicationSubmitButton.setAttribute('data-kt-indicator', 'on');

                // Disable button to avoid multiple click
                LeaveApplicationSubmitButton.disabled = true;

                // Simulate form submission. For more info check the plugin's official documentation: https://sweetalert2.github.io/
                setTimeout(function () {
                    // Remove loading indication
                    LeaveApplicationSubmitButton.removeAttribute('data-kt-indicator');

                    // Enable button
                    LeaveApplicationSubmitButton.disabled = false;

                    // Show popup confirmation
                    // Swal.fire({
                    //     text: "Form has been successfully submitted!",
                    //     icon: "success",
                    //     buttonsStyling: false,
                    //     confirmButtonText: "Ok, got it!",
                    //     customClass: {
                    //         confirmButton: "btn btn-primary"
                    //     }
                    // });

                    addLeaveApplicationForm.submit(); // Submit form
                }, 1500);
            }
        });
    }
});


$('#employee_id').on('change', function () {
    // Other Change Elements
    const total_allowed = $("#total_allowed");
    const consumed = $("#consumed");
    const remaining = $("#remaining");
    const impact_on_pay = $("#impact_on_pay");
    const went_wrong = $("#went_wrong");
    const start_date = $("#start_date");
    const end_date = $("#end_date");
    const duration = $("#duration");
    const current_impact = $('#current_impact');
    const remaining_after = $('#remaining_after');
    const submit_btn = $("#re_add_leave_application_submit");
    const over_days = $("#over_days");

    submit_btn.prop("disabled", false);
    over_days.addClass('d-none');
    impact_on_pay.val("");
    total_allowed.text("");
    consumed.text("");
    remaining.text("");
    went_wrong.addClass('d-none');
    start_date.val("");
    end_date.val("");
    end_date.prop("disabled", false);
    end_date.css("cursor", "pointer");
    duration.empty();
    current_impact.text("");
    remaining_after.text("");
    //

    const employee_id = $(this).val();
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    const leave_type_id = $('#leave_type_id');
    const my_leave_types = $("#my_leave_types");
    const policy_error = $("#policy_error");

    leave_type_id.empty();
    my_leave_types.empty();
    policy_error.addClass('d-none');

    if (employee_id) {
        $.ajax({
            url: '/hr/leave-applications/emp-policy-data',
            type: 'POST',
            data: {
                employee_id: employee_id,
                _token: csrfToken,
            },
            success: function (data) {
                leave_type_id.append('<option value=""></option>');
                for (var policy in data.leave_policy) {
                    leave_type_id.append('<option value="' + data.leave_policy[policy].id + '">' + data.leave_policy[policy].leave_type.name + '</option>');
                    // Hidden data
                    my_leave_types.append('<input type="number" id="' + data.leave_policy[policy].id + 'allowed" value="' + data.leave_policy[policy].allowed + '">');
                    my_leave_types.append('<input type="number" id="' + data.leave_policy[policy].id + 'impact" value="' + data.leave_policy[policy].impact_on_pay + '">');

                }
            },
            error: function (data) {
                policy_error.removeClass('d-none');
            }
        });
    } else {

    }
});

$('#leave_type_id').on('change', function () {
    //
    const current_impact = $('#current_impact');
    const remaining_after = $('#remaining_after');
    const submit_btn = $("#re_add_leave_application_submit");
    const over_days = $("#over_days");

    submit_btn.prop("disabled", false);
    over_days.addClass('d-none');
    current_impact.text("");
    remaining_after.text("");
    //
    const policy_record_id = $(this).val();
    const employee_id =  $('#employee_id').val();
    const field_allowed = $("#"+policy_record_id + 'allowed').val();
    const field_impact = $("#"+policy_record_id + 'impact').val();

    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    const total_allowed = $("#total_allowed");
    const consumed = $("#consumed");
    const remaining = $("#remaining");
    const impact_on_pay = $("#impact_on_pay");
    const went_wrong = $("#went_wrong");
    const duration = $("#duration");
    const start_date = $("#start_date");
    const end_date = $("#end_date");


    impact_on_pay.val("");
    total_allowed.text("");
    consumed.text("");
    remaining.text("");
    went_wrong.addClass('d-none');
    duration.empty();
    start_date.val("");
    end_date.val("");
    end_date.prop("disabled", false);
    end_date.css("cursor", "pointer");

    if (policy_record_id) {
        $.ajax({
            url: '/hr/leave-applications/emp-leave-calculations',
            type: 'POST',
            data: {
                employee_id: employee_id,
                policy_record_id: policy_record_id,
                _token: csrfToken,
            },
            success: function (data) {
            impact_on_pay.val(field_impact);
            total_allowed.text(field_allowed);
            consumed.text(data.consumed);
            remaining.text(field_allowed-data.consumed);
            //
                if ((field_allowed-data.consumed) <= 0.0) {
                    duration.empty();
                    duration.append(`<option value="">Select</option>`);
                }
                else if ((field_allowed-data.consumed) < 1) {
                    duration.empty();
                    duration.append(`<option value="">Select</option>`);
                    duration.append(`<option value="Half Day">Half Day</option>`);

                    end_date.css("cursor", "not-allowed");
                    end_date.prop("disabled", true);

                }
                else if ((field_allowed-data.consumed) == 1 || (field_allowed-data.consumed) == 1.5) {
                    duration.empty();
                    duration.append(`<option value="">Select</option>`);
                    duration.append(`<option value="Half Day">Half Day</option>`);
                    duration.append(`<option value="Full Day">Full Day</option>`);

                    end_date.css("cursor", "not-allowed");
                    end_date.prop("disabled", true);

                }
                else if
                ((field_allowed-data.consumed) >= 2) {
                    duration.empty();
                    duration.append(`<option value="">Select</option>`);
                    duration.append(`<option value="Half Day">Half Day</option>`);
                    duration.append(`<option value="Full Day">Full Day</option>`);
                    duration.append(`<option value="Multiple Day">Multiple Day</option>`);
                }
            //
            // Revalidate
                addLeaveApplicationValidator.revalidateField('impact_on_pay');
            },
            error: function (data) {
                went_wrong.removeClass('d-none');
            }
        });
    }
});

$("#duration").on('change', function (){
    const start_date = $("#start_date");
    const end_date = $("#end_date");
    const current_impact = $('#current_impact');
    const remaining_after = $('#remaining_after');

    const submit_btn = $("#re_add_leave_application_submit");
    const over_days = $("#over_days");

    submit_btn.prop("disabled", false);
    over_days.addClass('d-none');

    if ($(this).val() === "Half Day") {
        end_date.prop("disabled", true);
        end_date.css("cursor", "not-allowed");

        end_date.removeAttr('min');
        if (start_date.val() !== "") {
            // Code to set the end_date as the same as start_date
            end_date.val(start_date.val());

            current_impact.text(0.5);
            remaining_after.text(($("#remaining").text()-0.5).toFixed(1));
        }

    }
    else if ($(this).val() === "Full Day") {
        end_date.prop("disabled", true);
        end_date.css("cursor", "not-allowed");

        end_date.removeAttr('min');
        if (start_date.val() !== "") {
            const endDate = new Date(start_date.val());
            endDate.setDate(endDate.getDate());
            end_date.val(endDate.toISOString().split('T')[0]);

            current_impact.text(1);
            remaining_after.text(($("#remaining").text()-1).toFixed(1));
        }

    }
    else if ($(this).val() === "Multiple Day") {
        end_date.prop("disabled", false);
        end_date.css("cursor", "pointer");

        end_date.val("");
        start_date.val("");
        current_impact.text("");
        remaining_after.text("");

    }
    else
    {
        end_date.prop("disabled", false);
        end_date.css("cursor", "pointer");
        end_date.val("");
        start_date.val("");

        current_impact.text("");
        remaining_after.text("");
    }

    // Revalidate
    addLeaveApplicationValidator.revalidateField('end_date');
    addLeaveApplicationValidator.revalidateField('start_date');
});

$('#start_date').on('change', function () {
    const start_date = $(this).val();
    const duration = $('#duration').val();
    const end_date = $('#end_date');

    const current_impact = $('#current_impact');
    const remaining_after = $('#remaining_after');
    const submit_btn = $("#re_add_leave_application_submit");
    const over_days = $("#over_days");

    submit_btn.prop("disabled", false);
    over_days.addClass('d-none');

    if (duration === 'Half Day') {
        end_date.removeAttr('min');
        end_date.val(start_date);

        current_impact.text(0.5);
        remaining_after.text(($("#remaining").text()-0.5).toFixed(1));

    }
    else if (duration === 'Full Day') {
        end_date.removeAttr('min');
        const endDate = new Date(start_date);
        endDate.setDate(endDate.getDate());
        end_date.val(endDate.toISOString().split('T')[0]);

        current_impact.text(1);
        remaining_after.text(($("#remaining").text()-1).toFixed(1));

    }
    else if (duration === 'Multiple Day') {
        end_date.val("");
        const minEndDate = new Date(start_date);
        minEndDate.setDate(minEndDate.getDate() + 1);
        end_date.attr('min', minEndDate.toISOString().split('T')[0]);

        current_impact.text(0);
        remaining_after.text(0);
    }

    // Revalidate
    addLeaveApplicationValidator.revalidateField('end_date');
    addLeaveApplicationValidator.revalidateField('start_date');
});

$('#end_date').on('change', function () {
    const end_date = $(this).val();
    const duration = $('#duration').val();
    const start_date = $('#start_date').val();

    const current_impact = $('#current_impact');
    const remaining_after = $('#remaining_after');
    const submit_btn = $("#re_add_leave_application_submit");
    const over_days = $("#over_days");

    submit_btn.prop("disabled", false);
    over_days.addClass('d-none');
    if (duration === 'Multiple Day' && start_date) {
        const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
        const startDateObj = new Date(start_date);
        const endDateObj = new Date(end_date);
        const totalDays = Math.round(Math.abs((endDateObj - startDateObj) / oneDay)) + 1;

        current_impact.text(totalDays);
        remaining_after.text(($("#remaining").text()-totalDays).toFixed(1));
        const requested_days = ($("#remaining").text()-totalDays).toFixed(1);
        if (requested_days<0){
            submit_btn.prop("disabled", true);
            over_days.removeClass('d-none');
        }
    }
});
