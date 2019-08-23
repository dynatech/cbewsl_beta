<nav>
    <div class="nav nav-tabs" id="nav-tab" role="tablist">
        <a class="nav-item nav-link active" id="current_alert_tab" data-toggle="tab" href="#current_alert" role="tab" aria-controls="current_alert" aria-selected="true">Current Alert</a>
        <a class="nav-item nav-link" id="alert_validation_tab" data-toggle="tab" href="#alert_validation" role="tab" aria-controls="alert_validation" aria-selected="false">Alert Validation</a>
    </div>
</nav>
<div class="tab-content" id="nav-tabContent">
    <div class="tab-pane fade show active" id="current_alert" role="tabpanel" aria-labelledby="current_alert_tab">
        <div class="card">
            <div class="card-body">
                <div id="ewi_current_alert_container">
                    <div class="row">
                        <div class="col text-center" style="color: #ee9d01;">
                            <h4><b id="ewi_alert_symbol">Alert 2</b></h4>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col text-center">
                            <h5>Triggers</h5>
                            <div id="triggers"></div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col text-center">
                            <br>
                            <h5>Validity</h5>
                            <div id="validity"></div>
                        </div>
                    </div>
                    <div class="row" id="release_alert_button">
                        <div class="col text-center">
                        </div>
                        <div class="col text-center" id="release_ewi">
                        </div>
                        <div class="col text-center">
                        </div>
                    </div>
                    <div class="row" id="current_alert_buttons">
                        <div class="col-1">
                            <input class="btn btn-primary" type="button" value="e-Mail" style="background-color: #195770;">
                        </div>
                        <div class="col-1">
                            <input class="btn btn-primary" type="button" value="f | SHARE" style="background-color: #195770;" onClick="LaunchFeedDialog()"/>
                        </div>
                        <div class="col-1">
                            <input class="btn btn-primary" type="button" value="PRINT" style="background-color: #195770;">
                        </div>
                    </div>
                </div>

                <div id="ewi_for_lowering">
                    <div class="row">
                        <div class="col text-center" style="color: #ee9d01;">
                            <h4><b id="ewi_lowering_details">Alert 2</b></h4>
                        </div>
                    </div>
                    <div class="row" id="ewi_lowering_button">
                        <div class="col text-center">
                        </div>
                        <div class="col text-center" id="lower_ewi">
                        </div>
                        <div class="col text-center">
                        </div>
                    </div>
                </div>

                <div id="ewi_no_current_alert">
                    <div class="col text-center">
                        <h4><b>No current alert</b></h4>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="tab-pane fade" id="alert_validation" role="tabpanel" aria-labelledby="alert_validation_tab">
        <div class="card">
            <div class="card-body">
            <div id="no_candidate_alert">
                <div class="col text-center">
                    <h4><b>No candidate alert</b></h4>
                </div>
            </div>
            <div class="row" id="candidate_alert_information">
                    <div class="col text-center">
                        <h2 style="color: #717171;">Validated Alert from PHIVOLCS</h2>
                        <div id="candidate_alert_list"></div>
                        <!-- <h4><b id="alert_symbol" style="color: #ee9d01;">Alert 2</b></h4>
                        <h5 id="alert_trigger">NULL</h5>
                        <h5 id="alert_information">NULL</h5> -->
                        <div id="candidate_alert_release_button"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>