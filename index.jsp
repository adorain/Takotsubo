<%@page import="com.common.Utility.Translator"%>
<%@page import="com.common.Utility.MiscUtility"%>
<!DOCTYPE html>
<html dir="ltr">

    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <!-- Tell the browser to be responsive to screen width -->
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="">
        <meta name="author" content="">
        <!-- Favicon icon -->
        <link rel="icon" type="image/png" sizes="16x16" href="<%= MiscUtility.getServerIP() %>/infohub/assets/images/favicon.png">
        <title>INFOHUB</title>
        <!-- Custom CSS -->
        <link href="<%= MiscUtility.getServerIP() %>/infohub/dist/css/style.min.css" rel="stylesheet">
        <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
        <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
        <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
    </head>

    <body>
        <div class="main-wrapper">
            <!-- ============================================================== -->
            <!-- Preloader - style you can find in spinners.css -->
            <!-- ============================================================== -->
            <div class="preloader">
                <div class="lds-ripple">
                    <div class="lds-pos"></div>
                    <div class="lds-pos"></div>
                </div>
            </div>
            <!-- ============================================================== -->
            <!-- Preloader - style you can find in spinners.css -->
            <!-- ============================================================== -->
            <!-- ============================================================== -->
            <!-- Login box.scss -->
            <!-- ============================================================== -->
            <div class="auth-wrapper d-flex flex-column no-block justify-content-center align-items-center "
                 style="background:linear-gradient(to right, #6441a5, #2a0845);">
                <div class="row justify-content-center align-items-center">
                    <div class="col-lg-5 col-md-3 mb-5">
                        <img src="<%= MiscUtility.getServerIP() %>/infohub/assets/images/icon/system_logo_white.png" alt="image" class="justify-content-center"
                                     width="400">
                    </div>
                    <div class="card rounded-3 col-lg-6  col-md-5">
                        <div class="card-body">
                            <div class="row justify-content-center align-items-center mb-1">
                                <img src="<%= MiscUtility.getServerIP() %>/infohub/assets/images/icon/system_icon.png" alt="image" class="rounded-circle"
                                     width="150">
                            </div>
                            <div class="row justify-content-center align-items-center mb-2">
                                <h1 class="card-title text-primary ">Welcome!</h1>
                            </div>
                            <div class="row, text-center">
                                <p class="text-center fs-6">Please sign in to the system by using the credential provided by your Admin</p>
                            </div>

                            <form class="mt-3">
                                <div class="col-md-12 mb-5">
                                    <label class="form-control-label" for="inputSuccess1">Username:</label>
                                    <input type="text" id="uname" class="form-control">
                                </div>


                                <div class="col-md-12">
                                    <label class="form-control-label" for="inputSuccess1">Password:</label>
                                    <input type="password" id="pwd" class="form-control">
                                </div>

                                <div class="col-md-12 mt-5">
                                    <button type="button" class="btn btn-block btn-primary" onclick="javascript:submitLoginForm()">SIGN IN</button>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>

                <div id="error-modal" class="modal fade" tabindex="-1" role="dialog"
                     aria-hidden="true">
                    <div class="modal-dialog modal-sm modal-dialog-centered">
                        <div class="modal-content modal-filled bg-danger">
                            <div class="modal-body p-4">
                                <div class="text-center">
                                    <i class="dripicons-wrong h1"></i>
                                    <h3 class="mt-2"><strong>Unexpected Error</strong></h3>
                                    <p id="errorMessage" class="mt-3"></p>
                                    <button type="button" class="btn btn-light my-2"
                                            data-dismiss="modal">OK</button>
                                </div>
                            </div>
                        </div><!-- /.modal-content -->
                    </div><!-- /.modal-dialog -->
                </div><!-- /.modal -->
                <!-- ============================================================== -->
                <!-- Login box.scss -->
                <!-- ============================================================== -->
            </div>
            <!-- ============================================================== -->
            <!-- All Required js -->
            <!-- ============================================================== -->
            <script src="<%= MiscUtility.getServerIP() %>/infohub/assets/libs/jquery/dist/jquery.min.js "></script>
            <!-- Bootstrap tether Core JavaScript -->
            <script src="<%= MiscUtility.getServerIP() %>/infohub/assets/libs/popper.js/dist/umd/popper.min.js "></script>
            <script src="<%= MiscUtility.getServerIP() %>/infohub/assets/libs/bootstrap/dist/js/bootstrap.min.js "></script>
            <script src="<%= MiscUtility.getServerIP() %>/infohub/js/core_scripts.js "></script>
            <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
            <!-- ============================================================== -->
            <!-- This page plugin js -->
            <!-- ============================================================== -->
            <script>
            $(".preloader ").fadeOut();

            function submitLoginForm() {
                //                var username = $("#uname").val();
                //                var password = $("#pwd").val();
                console.log("LOGIN");
                request.post({
                    baseUrl: '<%= MiscUtility.getServerIP()%>',
                    url: '/API/AD/login',
                    data: {
                        'entity': {
                            'userId': $("#uname").val(),
                            'password': $("#pwd").val()
                        }
                    }
                }).then((response) => {
                    console.log(response);
                    if (response.status === 'ok') {
                        if(response.data.duplicateLogin)
                        {
                            Swal.fire({
                              title: "<%= Translator.INSTANCE.translate("DUP_LOGIN_TITLE", "EN") %>",
                              text: "<%= Translator.INSTANCE.translate("USR_ID_USED", "EN") %>",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonText: "<%= Translator.INSTANCE.translate("F_LOGIN_BTN", "EN") %>",
                              cancelButtonText: "Cancel",
                              confirmButtonColor: "#d33",
                              cancelButtonColor: "#3085d6",
                              reverseButtons: true
                            }).then((result) => {
                              if (result.isConfirmed) {
                                request.post({
                                    baseUrl: '<%= MiscUtility.getServerIP()%>',
                                    url: '/API/AD/forceLogin',
                                    data: {
                                        'entity': {
                                            'userId': $("#uname").val(),
                                            'password': $("#pwd").val()
                                        }
                                    }
                                }).then((response) => {
                                    session.set("userid", response.data.userId);
                                    session.set("username", response.data.firstName + " " +response.data.lastName)
                                    session.set("auth", response.data.authLevel);
                                    cookie.set("USR_LNG", response.data.user_lang);
                                    
                                    window.open('<%= MiscUtility.getServerIP()%>' +'/infohub/dashboard.jsp','',"top=0,left=0,width="  +
                                        (window.screen.availWidth ) + ",height=" +
                                        (window.screen.availHeight - 50) +
                                        ",status=1,toolbar=0,menubar=0,location=0,resizable=1");
                                    window.opener='Self'; 
                                    window.open('','_parent',''); 
//                                    window.location.href = '<%= MiscUtility.getServerIP()%>' + '/hirarc/dashboard.jsp';
                                })
                              } 
                            });
                        }
                        else
                        {
                            session.set("userid", response.data.userId);
                            session.set("username", response.data.firstName + " " +response.data.lastName)
                            session.set("auth", response.data.authLevel);
                            cookie.set("USR_LNG", response.data.user_lang);
                            window.open('<%= MiscUtility.getServerIP()%>' +'/infohub/dashboard.jsp','',"top=0,left=0,width="  +
                                        (window.screen.availWidth ) + ",height=" +
                                        (window.screen.availHeight - 50) +
                                        ",status=1,toolbar=0,menubar=0,location=0,resizable=1");
                                    window.opener='Self'; 
                                    window.open('','_parent','');
                        }
                        
                    } else {
                        Swal.fire({
                            titleText: 'Unexpected Error',
                            html: response.message,
                            icon: 'error',
                          })

                    }
                })
            }
            </script>
    </body>

</html>