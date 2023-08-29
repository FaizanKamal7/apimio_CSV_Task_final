"use strict";
var KTAppRealestateProperties = function () {
    var t, e, o = () => {
        t.querySelectorAll('[data-kt-ecommerce-product-filter="delete_row"]').forEach((t => {
            t.addEventListener("click", (function (t) {
                t.preventDefault();
                const o = t.target.closest("tr"),
                    n = o.querySelector('[data-kt-ecommerce-product-filter="product_name"]').innerText;
                Swal.fire({
                    text: "Are you sure you want to delete " + n + "?",
                    icon: "warning",
                    showCancelButton: !0,
                    buttonsStyling: !1,
                    confirmButtonText: "Yes, delete!",
                    cancelButtonText: "No, cancel",
                    customClass: {
                        confirmButton: "btn fw-bold btn-danger",
                        cancelButton: "btn fw-bold btn-active-light-primary"
                    }
                }).then((function (t) {
                    t.value ? Swal.fire({
                        text: "You have deleted " + n + "!.",
                        icon: "success",
                        buttonsStyling: !1,
                        confirmButtonText: "Ok, got it!",
                        customClass: {confirmButton: "btn fw-bold btn-primary"}
                    }).then((function () {
                        e.row($(o)).remove().draw()

                    })) : "cancel" === t.dismiss && Swal.fire({
                        text: n + " was not deleted.",
                        icon: "error",
                        buttonsStyling: !1,
                        confirmButtonText: "Ok, got it!",
                        customClass: {confirmButton: "btn fw-bold btn-primary"}
                    })
                }))
            }))
        }))
    };
    return {
        init: function () {
            (t = document.querySelector("#kt_ecommerce_products_table")) && ((e = $(t).DataTable({
                info: !1,
                order: [],
                pageLength: 10,
                columnDefs: [{orderable: !1, targets: 0}, {orderable: !1, targets: 7}]
            })).on("draw", (function () {
                o()
            })), document.querySelector('[data-kt-ecommerce-product-filter="search"]').addEventListener("keyup", (function (t) {
                e.search(t.target.value).draw()
            })), (() => {
                const t = document.querySelector('[data-kt-ecommerce-product-filter="status"]');
                $(t).on("change", (t => {
                    let o = t.target.value;
                    "all" === o && (o = ""), e.column(1).search(o).draw()
                }))
            })(), o())
        }
    }
}();
KTUtil.onDOMContentLoaded((function () {
    KTAppRealestateProperties.init()
}));
