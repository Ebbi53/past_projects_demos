define(["jquery", "underscore", "backbone", "text!template/preview.html", "formData_preparation", "model/session", "router", "file_upload", "core-js/modules/es6.promise", "core-js/modules/es6.object.to-string", "core-js/modules/es6.array.find", "regenerator-runtime/runtime", "_asyncToGenerator"], function (a, b, c, d, f, g, h, i, j, k, l, m, n) {
    return c.View.extend({
        tagname: "div", className: "fadeIn container", id: "preview", template: d, initialize: function () { this.render() }, events: {
            "click #submit_button": function () {
                var b = n(/*#__PURE__*/regeneratorRuntime.mark(function b(d) {
                    return regeneratorRuntime.wrap(function (b) {
                        for (; ;)switch (b.prev = b.next) {
                            case 0: return a(d.currentTarget).html("<i class=\"fa fa-spinner fa-spin\"></i> Submitting"), a(d.currentTarget).prop("disabled", !0), a(d.currentTarget).css({ color: "black", "background-color": "orange", "border-color": "orange" }), b.next = 5, f(); case 5: if (!b.sent) { b.next = 9; break }// Session.set('complete', true);
                                h.navigate("success", { trigger: !0 }), b.next = 10; break; case 9: c.Events.trigger("showError", "server"); case 10: a("#confirmation").modal("hide"), a(d.currentTarget).html("Submit"), a(d.currentTarget).prop("disabled", !1), a(d.currentTarget).css({ color: "white", "background-color": "#428BCA", "border-color": "#428BCA" }); case 14: case "end": return b.stop();
                        }
                    }, b)
                })); return function () { return b.apply(this, arguments) }
            }(), "click #print_button": function () { window.print() }, "click #back_button": function () { h.navigate("", { trigger: !1 }), this.remove(), a("#form_wrapper").show() }
        }, render: function () { this.$el.html(b.template(this.template)), a(document).ready(function () { for (var b in a("footer").show(), a(window).scrollTop(0), a("#body").height() + 100 > window.innerHeight ? (a("body").css("position", "relative"), a("footer").css("bottom", -a("footer").height() + "px")) : (a("body").css("position", "static"), a("footer").css("bottom", 0)), a("#uploadedPhoto").attr("src", i.getFileURL()), a("#applicant_name").text(a("#first_name").val() + " " + a("#family_name").val()), a(".second_column").each(function () { var b = a(this).attr("id").slice(0, -8), c = a("#" + b).val(); a(this).text(c) }), a("#home_number_preview").text(a("#home_area_code").val() + " " + a("#home_number").val()), a("#mobile_number_preview").text(a("#mobile_area_code").val() + " " + a("#mobile_number").val()), a("#referee_telephone_preview").text(a("#referee_area_code").val() + " " + a("#referee_telephone").val()), a("input:radio[name=\"gender\"]:checked").each(function () { a("#gender_preview").append(a(this).val()) }), a("input:radio[name=\"university_invitation\"]").each(function () { a(this).is(":checked") && ("yes" == a(this).val() ? a("#interview_invitation_preview").append(a(this).val() + ", on " + a("#date_of_invitation").val()) : a("#interview_invitation_preview").append(a(this).val())) }), a("input:checkbox[name=\"source\"]").each(function () { a(this).is(":checked") && ("Others" == a(this).val() ? a("#source_preview").append(a(this).val() + "( " + a("input:text[name=\"specific_of_other_source\"]").val() + " ) ") : a("#source_preview").append(a(this).val() + ", ")) }), a("input:radio[name=\"other_scholarship_application\"]").each(function () { a(this).is(":checked") && (a("#other_scholarship_plan_preview").append(a(this).val()), "yes" == a(this).val() && (a("#other_scholarship_preview").show(), a(".scholarship").each(function () { a("#scholarship_preview").append(a(this).index() + 1 + ". " + a(this).find(".scholarship_name").val() + " - " + a(this).find(".scholarship_type").val() + "<br>") }))) }), a("input:radio[name=\"sent_email_to_school_principal\"]").each(function () { a(this).is(":checked") && a("#request_reference_preview").append(a(this).val()) }), a("#type_preview").text(a("#type").val()), str = "", a(".grades").each(function () { $grade = "<b>" + a(this).prev().text() + ":</b> " + a(this).val() + " ", a("#grades_preview").append($grade) }), a(".leadership_experience").each(function () { $element = "<div class = \"col-md-12\"><span class=\"badge badge-primary\" style=\"font-size:7px;\">" + a(this).find("#record_num").text() + "</span><br><table class = \"table table-striped table-sm\"><tbody>", $element = $element + "<tr><td class = \"first_column\">Association / Club / Project</td><td class = \"second_column\">" + a(this).find(".club_name").val() + "</td></tr>", $element = $element + "<tr><td class = \"first_column\">Duration</td><td class = \"second_column\">" + a(this).find(".club_from").val() + " to " + a(this).find(".club_to").val() + "</td></tr>", $element = $element + "<tr><td class = \"first_column\">Leadership Role</td><td class = \"second_coolumn\">" + a(this).find(".club_role").val() + "</td></tr></tbody></table></div>", a("#activities_preview").append($element) }), i.uploadData) a("#" + b + "_preview").text(i.uploadData[b]) }) }
    })
});