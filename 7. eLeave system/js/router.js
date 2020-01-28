
// applciation frontend router, implemented with backbone.js
define(['jquery', 'underscore', 'backbone', 'moduleConfig', 'view/header', 'view/footer', 'cookie'], function ($, _, Backbone, moduleConfig, HeaderView, FooterView, Cookie) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            'leave_application': 'leave_application',
            'leave_balance': 'leave_balance',
            'team_leave_balance': 'team_leave_balance',
            'leave_history': 'leave_history',
            'leave_application_approval': 'leave_application_approval',
            'leave_application_endorsement': 'leave_application_endorsement',
            'subordinates_leave_history': 'subordinates_leave_history',
            'team_leave_history': 'team_leave_history',
            'user': 'user',
            'switch_user': 'switch_user',
            'onetimeToken/:oneTimeAuthToken': 'onetime_token',
            'approve_from_email/:zgOneTimeApprovalToken': 'leave_application_approval_from_email',
            'endorse_from_email/:zgOneTimeEndorsementToken': 'leave_application_endorsement_from_email',
            'login': 'login',
            '*referrer/login': 'login',
            'logout': 'logout',
            '*referrer/logout': 'logout',
            '*action': 'default',
            '': 'default'
        }
    });

    var init = function init() {
        var that = this;
        var app_router = new AppRouter();
        console.log("initcalled");
        $(window).on('resize', function () {
            if ($(window).width() > 1024) {
                $('[data-toggle="tooltip"]').tooltip('enable'); 
            } else {
                $('[data-toggle="tooltip"]').tooltip('disable'); 
            }
        }); 
        //    Backbone.history.start({ pushState: true, hashChange:false });

        /*  leave_application    */

        app_router.on('route:leave_application', function (action) {
            if (!auth(true)) return;

            var vent = _.extend({}, Backbone.Events);

            require(['view/leave_application'], function (LeaveApplicationView) {
                $('#header').html(new HeaderView({
                    vent: vent,
                    hasMenu: false
                }).el);
                $('#footer').html(new FooterView({
                    vent: vent
                }).el);
                $('#body').html(new LeaveApplicationView({
                    vent: vent
                }).el);
            });
        });
        app_router.on('route', function (route, params) {
            if ($.fn.dataTable) {
                var tables = $.fn.dataTable.tables();
                $(tables).each(function () {
                    $(this).DataTable().destroy();
                    $(this).remove(); 
                });
            }

            $(window).off('scroll');
        });
        /*  leave_balance    */

        app_router.on('route:leave_balance', function (action) {
            if (!auth(true)) return;

            var vent = _.extend({}, Backbone.Events);

            require(['view/leave_balance'], function (LeaveBalanceView) {
                $('#header').html(new HeaderView({
                    vent: vent,
                    hasMenu: false
                }).el);
                $('#footer').html(new FooterView({
                    vent: vent
                }).el);
                $('#body').html(new LeaveBalanceView({
                    vent: vent
                }).el);
            });
        });
        /*  team_leave_balance    */

        app_router.on('route:team_leave_balance', function (action) {
            if (!auth(true)) return;

            var vent = _.extend({}, Backbone.Events); 

            require(['view/team_leave_balance'], function (TeamLeaveBalanceView) {
                $('#header').html(new HeaderView({
                    vent: vent,
                    hasMenu: false
                }).el);
                $('#footer').html(new FooterView({
                    vent: vent
                }).el);
                $('#body').html(new TeamLeaveBalanceView({
                    vent: vent
                }).el);
            });
        });
        /*  leave_history    */

        app_router.on('route:leave_history', function (action) {
            if (!auth(true)) return;

            var vent = _.extend({}, Backbone.Events);

            require(['view/leave_history'], function (LeaveHistoryView) {
                $('#header').html(new HeaderView({
                    vent: vent,
                    hasMenu: false
                }).el);
                $('#footer').html(new FooterView({
                    vent: vent
                }).el);
                $('#body').html(new LeaveHistoryView({
                    vent: vent
                }).el);
            });
        });
        /*  leave_application_approval    */

        app_router.on('route:leave_application_approval', function (action) {
            if (!auth(true)) return;

            var vent = _.extend({}, Backbone.Events);

            require(['view/leave_application_approval'], function (LeaveApplicationApprovalView) {
                $('#header').html(new HeaderView({
                    vent: vent,
                    hasMenu: false
                }).el);
                $('#footer').html(new FooterView({
                    vent: vent
                }).el);
                $('#body').html(new LeaveApplicationApprovalView({
                    vent: vent
                }).el);
            });
        });
        /*  leave_application_endorsement    */

        app_router.on('route:leave_application_endorsement', function (action) {
            if (!auth(true)) return;

            var vent = _.extend({}, Backbone.Events);

            require(['view/leave_application_endorsement'], function (LeaveApplicationEndorsementView) {
                $('#header').html(new HeaderView({
                    vent: vent,
                    hasMenu: false
                }).el);
                $('#footer').html(new FooterView({
                    vent: vent
                }).el);
                $('#body').html(new LeaveApplicationEndorsementView({
                    vent: vent
                }).el);
            });
        });
        /*	subordinates_leave_history	*/

        app_router.on('route:subordinates_leave_history', function (action) {
            if (!auth(true)) return;

            var vent = _.extend({}, Backbone.Events);

            require(['view/subordinates_leave_history' 
            
            ], function (SubordinatesLeaveHistoryView) {
                $('#header').html(new HeaderView({
                    vent: vent,
                    hasMenu: false
                }).el);
                $('#footer').html(new FooterView({
                    vent: vent
                }).el);
                $('#body').html(new SubordinatesLeaveHistoryView({
                    vent: vent
                }).el);
            });
        });
        /*	subordinates_leave_history	*/

        app_router.on('route:team_leave_history', function (action) {
            if (!auth(true)) return;

            var vent = _.extend({}, Backbone.Events);

            require(['view/team_leave_history'], function (LeaveHistoryView) {
                $('#header').html(new HeaderView({
                    vent: vent,
                    hasMenu: false
                }).el);
                $('#footer').html(new FooterView({
                    vent: vent
                }).el);
                $('#body').html(new LeaveHistoryView({
                    vent: vent
                }).el);
            });
        });
        /*	leave_application_approval_from_email	*/

        app_router.on('route:leave_application_approval_from_email', function (zgOneTimeApprovalToken) {
            var vent = _.extend({}, Backbone.Events);

            require(['view/leave_application_approval', 'model/leave_application_approval'], function (LeaveApplicationApprovalView, LeaveApplicationApprovalModel) {
                $('#header').html(new HeaderView({
                    vent: vent,
                    hasMenu: false
                }).el);
                $('#footer').html(new FooterView({
                    vent: vent
                }).el);
                var leaveApplication = new LeaveApplicationApprovalModel();
                leaveApplication.fetch({
                    data: {
                        zgOneTimeApprovalToken: zgOneTimeApprovalToken
                    },
                    success: function success() {
                        var collectionJSON = [leaveApplication];
                        $('#body').html(new LeaveApplicationApprovalView({
                            vent: vent,
                            collectionJSON: collectionJSON,
                            isOneTime: true,
                            zgOneTimeApprovalToken: zgOneTimeApprovalToken
                        }).el);
                    },
                    error: function error() {
                        Backbone.trigger("global:danger", {
                            msg: 'Something went wrong, please try again.'
                        });
                    }
                });
            });
        });
        /*	leave_application_endorsement_from_email	*/

        app_router.on('route:leave_application_endorsement_from_email', function (zgOneTimeEndorsementToken) {
            var vent = _.extend({}, Backbone.Events);

            require(['view/leave_application_endorsement', 'model/leave_application_endorsement'], function (LeaveApplicationEndorsementView, LeaveApplicationEndorsementModel) {
                $('#header').html(new HeaderView({
                    vent: vent,
                    hasMenu: false
                }).el);
                $('#footer').html(new FooterView({
                    vent: vent
                }).el);
                var leaveEndorsement = new LeaveApplicationEndorsementModel();
                leaveEndorsement.fetch({
                    data: {
                        zgEndorserKey: zgOneTimeEndorsementToken
                    },
                    success: function success() {
                        var collectionJSON = [leaveEndorsement];
                        $('#body').html(new LeaveApplicationEndorsementView({
                            vent: vent,
                            collectionJSON: collectionJSON,
                            isOneTime: true,
                            zgEndorserKey: zgOneTimeEndorsementToken
                        }).el);
                    },
                    error: function error() {
                        Backbone.trigger("global:danger", {
                            msg: 'Something went wrong, please try again.'
                        });
                    }
                });
            });
        });
        /*  index    */

        app_router.on('route:default', function (action) {
            if (!auth(false)) return;

            var vent = _.extend({}, Backbone.Events);

            require(['view/main_container'], function (MainContainerView) {
                $('#header').html(new HeaderView({
                    vent: vent,
                    hasMenu: false
                }).el);
                $('#body').html(new MainContainerView({
                    vent: vent
                }).el);
                $('#footer').html(new FooterView({
                    vent: vent
                }).el);
            });
        });
        /*  Login    */

        app_router.on('route:login', function (referrer) {
            var vent = _.extend({}, Backbone.Events),
                referrerUrl = referrer || '';
            /*  login success   */


            vent.on('login:openTokenLogin', function (event) {
                window.location = window.location.pathname + '#' + referrerUrl;
            });
            vent.on('login:oneTimeTokenRequested', function (event) {
                $.removeCookie('runtime/session');
                moduleConfig.runtime.session = event.session.toJSON();
                extendSession();
                window.location = window.location.pathname + '#';
            });
            /*  login success   */

            vent.on('login:loginSuccess', function (event) {
                $.removeCookie('runtime/session');
                moduleConfig.runtime.session = event.session.toJSON();
                extendSession();
                window.location = window.location.pathname + '#' + referrerUrl;
            });
            /*  /login success   */

            clearSession();

            require(['view/login'], function (LoginView) {
                $('#header').html(new HeaderView({
                    vent: vent,
                    hasMenu: false
                }).el);
                $('#footer').html(new FooterView({
                    vent: vent
                }).el);
                readRuntimeSessionObjFromCookie();
                $('#body').html(new LoginView({
                    vent: vent,
                    modelJSON: moduleConfig.runtime.session
                }).el);
            });
        });
        /*  User    */

        app_router.on('route:user', function (referrer) {
            if (!auth(true)) return;

            var vent = _.extend({}, Backbone.Events);

            require(['view/user'], function (UserView) {
                $('#header').html(new HeaderView({
                    vent: vent,
                    hasMenu: false
                }).el);
                $('#footer').html(new FooterView({
                    vent: vent
                }).el);
                readRuntimeSessionObjFromCookie();
                $('#body').html(new UserView({
                    vent: vent
                }).el);
            });
        });
        app_router.on('route:onetime_token', function (OneTimeAuthToken) {
            /*	leave_application_approval_from_email	*/

            var vent = _.extend({}, Backbone.Events);

            require(['view/onetime_token', 'model/session'], function (OneTimeAuthTokenView, SessionModel) {
                //LeaveApplicationApprovalModel
                $('#header').html(new HeaderView({
                    vent: vent,
                    hasMenu: false
                }).el);
                $('#footer').html(new FooterView({
                    vent: vent
                }).el);
                $('#body').html(new OneTimeAuthTokenView({
                    vent: vent,
                    ottoken: OneTimeAuthToken
                }).el);
            });
        });

        app_router.on('route:switch_user', function (referrer) {
            if (!auth(true)) return;
            var referrerUrl = referrer || '';

            var vent = _.extend({}, Backbone.Events);

            vent.on('switch_user:cleared_all_open_tkn', function (event) {
                clearSession();

                window.location = window.location.href + (window.location.href.indexOf('#') == -1 ? '#' : '') + '/logout';
            });
            vent.on('switch_user:switch_user_auth_success', function (event) {
                $.removeCookie('runtime/session');
                moduleConfig.runtime.session = event.session.toJSON();
                extendSession();
                window.location = window.location.pathname + '#' + referrerUrl;
            });

            require(['view/switch_user'], function (SwitchUserView) {
                $('#header').html(new HeaderView({
                    vent: vent,
                    hasMenu: false
                }).el);
                $('#footer').html(new FooterView({
                    vent: vent
                }).el);
                readRuntimeSessionObjFromCookie();
                $('#body').html(new SwitchUserView({
                    vent: vent
                }).el);
            }); // clearSession();
            //   window.location = window.location.pathname + '#';

        });
        /*  Logout    */

        app_router.on('route:logout', function (referrer) {
            clearSession();
            window.location = window.location.pathname + '#';
        });
        Backbone.history.start(); // Backbone.history.start();
    };

    var readRuntimeSessionObjFromCookie = function readRuntimeSessionObjFromCookie() {
        if ($.cookie('runtime/session')) {
            moduleConfig.runtime.session = JSON.parse($.cookie('runtime/session'));
            Backbone.trigger('global:sessionUpdated');
        } else {
            moduleConfig.runtime.session = {};
        }

        if (typeof Storage !== "undefined") {
            if (localStorage.buf_session) {
                moduleConfig.runtime.buf_session = JSON.parse(localStorage.buf_session); // Code for localStorage/sessionStorage.

                Backbone.trigger('global:sessionUpdated');
            } else {
                moduleConfig.runtime.buf_session = {};
            }
        } else {
            if ($.cookie('runtime/buf_session')) {
                moduleConfig.runtime.buf_session = JSON.parse($.cookie('runtime/buf_session'));
                Backbone.trigger('global:sessionUpdated');
            } else {
                moduleConfig.runtime.buf_session = {};
            }
        }
    };

    var auth = function auth(isExt) {
        if (!moduleConfig.runtime) moduleConfig.runtime = {};
        var runtimeObj = moduleConfig.runtime;

        var redirectToLoginPage = function redirectToLoginPage() {
            window.location = window.location.href + (window.location.href.indexOf('#') == -1 ? '#' : '') + '/login';
        };

        var redirectToRootPage = function redirectToRootPage() {
            window.location = window.location.pathname + '#';
        };

        readRuntimeSessionObjFromCookie();

        if (typeof runtimeObj.session.OTTAuthed !== 'undefined') {
            if (isExt) {
                redirectToRootPage();
                return false;
            } else {
                return true;
            }
        }

        if (!runtimeObj.session || !runtimeObj.session.sessionToken) {
            redirectToLoginPage();
            return false;
        } else if (runtimeObj.session.timeout) {
            if (typeof runtimeObj.session.zgIsOpenToken !== 'undefined' && runtimeObj.session.zgIsOpenToken === 'Yes') {
                return true;
            }

            var timeoutDate = new Date(runtimeObj.session.timeout);

            if (timeoutDate.valueOf() < new Date().valueOf()) {
                Backbone.trigger("global:sessionTimeout");
                redirectToLoginPage();

                _.defer(function () {
                    Backbone.trigger("global:danger", {
                        msg: 'Session timeout'
                    });
                });

                return false;
            }
        }

        return true;
    };

    var clearSession = function clearSession() {
        moduleConfig.runtime = {};
        $.removeCookie('runtime/session');
        $.removeCookie('watched');
        Backbone.trigger('global:sessionUpdated');
    };

    var clearOpenSessionArr = function clearOpenSessionArr() {
        moduleConfig.runtime = {};

        if (localStorage.buf_session) {
            localStorage.removeItem("buf_session");
        } else {
            $.removeCookie('runtime/buf_session');
        }

        $.removeCookie('watched');
        Backbone.trigger('global:sessionUpdated');
    };

    var extendSession = function extendSession() {
        if (moduleConfig.runtime && moduleConfig.runtime.session) {
            var timeoutDate = new Date(moduleConfig.runtime.session.timeout);
            moduleConfig.runtime.session.timeout = parseInt(new Date().valueOf(), 10) + 3600 * 1000;
            $.cookie('runtime/session', JSON.stringify(moduleConfig.runtime.session), {
                expires: 90
            });
            Backbone.trigger('global:sessionUpdated');
        }
    };

    Backbone.on('global:ajaxSent', extendSession);
    return {
        init: init
    };
});