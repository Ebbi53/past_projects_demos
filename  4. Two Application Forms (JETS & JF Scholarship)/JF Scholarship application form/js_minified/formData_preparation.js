define(["jquery", "model/session", "file_upload", "api_config", "core-js/modules/es6.promise", "core-js/modules/es7.array.includes", "core-js/modules/es6.string.includes", "core-js/modules/web.dom.iterable", "core-js/modules/es6.array.iterator", "core-js/modules/es6.object.to-string", "core-js/modules/es6.object.keys", "core-js/modules/es6.array.find", "regenerator-runtime/runtime", "_asyncToGenerator"], function (a, b, c, d, e, f, g, h, i, j, k, l, m, n) { return (/*#__PURE__*/n(/*#__PURE__*/regeneratorRuntime.mark(function e() { var f, g, h, j, k, l, m, o, p, q, r, s, t; return regeneratorRuntime.wrap(function (e) { for (; ;)switch (e.prev = e.next) { case 0: s = function (a) { a["dse-grades"] = m, a["stpm-grades"] = o, a["gceal-grades"] = p, a["gce-grades"] = l, a["ib-grades"] = q, a["others-grades"] = r }, f = {}, g = [], h = [], j = [], k = !1, l = ["0", "0", "0", "0"], m = ["0", "0", "0", "0"], o = ["0", "0", "0"], p = ["0", "0", "0", "0", "0", "0", "0", "0", "0"], q = "0", r = "0", a(".sections").each(function () { var d, e, i = a(this), j = i.attr("id"), k = {}, n = 0; if ("activities" == j) { var t = []; i.find(".leadership_experience").each(function () { var b = {}; a(this).find("input").each(function () { b[a(this).attr("name")] = a(this).val() }), t.push(b) }), f.activities = t } else if ("uploaded_files" == j) for (var u in f.cv_upload = c.uploadData, f[j] = [], c.uploadData) f[j].push({ file: u, display_file_name: c.uploadData[u] }); else i.find("input, select, textarea").each(function () { switch (d = a(this).attr("name"), d) { case "gender": if (a(this).is(":checked")) { e = a(this).val(); break } else break; case "phone_home": e = a("#home_area_code").val() + " " + a("#home_number").val(); break; case "phone_mobile": e = a("#mobile_area_code").val() + " " + a("#mobile_number").val(); break; case "referee_telephone": e = a("#referee_area_code").val() + " " + a("#referee_telephone").val(); break; case "gce-grades": if (l[n] = a(this).val(), n++ , 4 == n) { k.acad_type = "gce", e = l, s(k), n = 0; break } break; case "ib-grades": q = a(this).val(), k.acad_type = "ib", e = q, s(k); break; case "dse-grades": if (m[n] = a(this).val(), n++ , 4 == n) { k.acad_type = "dse", e = m, s(k), n = 0; break } break; case "stpm-grades": if (o[n] = a(this).val(), n++ , 3 == n) { k.acad_type = "stpm", e = o, s(k), n = 0; break } break; case "gceal-grades": if (p[n] = a(this).val(), n++ , 9 == n) { k.acad_type = "gceal", e = p, s(k), n = 0; break } break; case "others-grades": r = a(this).val(), k.acad_type = "others", e = r, s(k); break; case "university_invitation": if (a(this).is(":checked")) { e = a(this).val(); break } else break; case "source": if (a(this).is(":checked")) { if ("Others" == a(this).val()) { var b = a("input:text[name=\"specific_of_other_source\"]").val(); k.specific_of_other_source = b } else k.specific_of_other_source = ""; g.push(a(this).val()) } e = g; break; case "sent_email_to_school_principal": if (a(this).is(":checked")) { e = a(this).val(); break } else break; case "other_scholarship_application": if (!a(this).is(":checked")) break; else if ("yes" == a(this).val()) { e = "yes", a(".scholarship").each(function () { var b = {}; b.scholarship_name = a(this).find(".scholarship_name").val(), b.scholarship_type = a(this).find(".scholarship_type").val(), h.push(b) }), k.name_of_scholarship = h; break } else { e = "no", k.name_of_scholarship = ""; break } case "*=name_of_scholarship": break; case "*=type_of_scholarship": break; default: e = a(this).val(); }k[d] = e, delete k[""], delete k[void 0]; for (var c = Object.keys(k), f = 0, i = c; f < i.length; f++)d = i[f], (d.includes("name_of_scholarship_") || d.includes("type_of_scholarship_")) && delete k[d] }), f[j] = k; f.token = b.get("applicationtoken") }), console.log(f), t = 0; case 15: if (!(2 > t) || k) { e.next = 21; break } return e.next = 18, new Promise(function (c) { a.ajax({ type: "POST", data: JSON.stringify(f), contentType: "application/json", url: d.protocol + d.domain + d.path + "application" }).done(/*#__PURE__*/function () { var a = n(/*#__PURE__*/regeneratorRuntime.mark(function a(c) { return regeneratorRuntime.wrap(function (a) { for (; ;)switch (a.prev = a.next) { case 0: if (2 == c.result_code) { a.next = 10; break } if (-9 != c.result_code && -10 != c.result_code) { a.next = 7; break } return a.next = 4, b.update(); case 4: k = a.sent, a.next = 8; break; case 7: k = !1; case 8: a.next = 11; break; case 10: k = !0; case 11: case "end": return a.stop(); } }, a) })); return function () { return a.apply(this, arguments) } }()).fail(function () { k = !1 }).always(function () { c() }) }); case 18: t++ , e.next = 15; break; case 21: return e.abrupt("return", k); case 22: case "end": return e.stop(); } }, e) }))) });