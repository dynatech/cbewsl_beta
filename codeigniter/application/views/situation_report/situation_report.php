<nav>
    <div class="nav nav-tabs" id="nav-tab" role="tablist">
        <a class="nav-item nav-link active" id="current_situation_report_tab" data-toggle="tab" href="#current_situation" role="tab" aria-controls="current_situation" aria-selected="true">Current Situation Report</a>
        <a class="nav-item nav-link" id="situation_logs_tab" data-toggle="tab" href="#situation_logs" role="tab" aria-controls="situation_logs" aria-selected="false">Situation Logs</a>
    </div>
</nav>
<div class="tab-content" id="nav-tabContent">
    <div class="tab-pane fade show active" id="current_situation" role="tabpanel" aria-labelledby="current_situation_report_tab">
        <div class="card">
            <div class="card-body">
                <img src="http://cbewsl.com/assets/images/letter_header1.png" width="1200px" height="70px"></img><img src="http://cbewsl.com/assets/images/banner_new.png" width="1200px" height="90px"></img>
                <p id="latest_situation_report_date_time">
                </p>
                <p id="latest_situation_report_summary">
                </p>
                <img src="http://cbewsl.com/assets/images/letter_footer1.png" width="1200px" height="90px"></img>
                <div class="float-left">
                    <button type="button" class="btn btn-primary btn-sm" id="send_current_situation_report">SEND</button>
                    <button type="button" class="btn btn-primary btn-sm" id="print_current_situation_report">SAVE & PRINT</button>
                </div>
            </div>
        </div>
    </div>
    <div class="tab-pane fade" id="situation_logs" role="tabpanel" aria-labelledby="situation_logs_tab">
        <div class="card">
            <div class="card-body">
                <div class="row">
                    <div class="col" id="situation_report_calendar"></div>
                    <div class="col" id="situation_report_data">
                        <div class="row">
                            <div class="col" id="situation_report_log">
                                <div id="current_situation_report_container">
                                    <p id="situation_report_date_time">
                                        Date : June 21, 2019
                                        Time : 3:30 pm
                                    </p>
                                    <p id="situation_report_summary">
                                        [data here]
                                    </p>
                                </div>
                                <div class="float-right">
                                    <button type="button" class="btn btn-primary btn-sm" id="edit_situation_report">Update</button>
                                    <button type="button" class="btn btn-danger btn-sm" id="delete_situation_report">Delete</button>
                                </div>
                            </div>
                            <div class="col" id="situation_report_form">
                                <input type="hidden" class="form-control" id="situation_report_id" value="0">
                                <div class="row">
                                    <div class="col">
                                        <form>
                                            <div class="form-group">
                                                <label id="situation_report_label">Please select a date</label><br>
                                                <input id="situation_log_time_picker" width="300" />
                                                <label for="summary">Summary</label>
                                                <textarea class="form-control" id="summary" style="height : 300px"></textarea><br>
                                                <button type="button" class="btn btn-primary btn-sm float-right" id="add_situation_report">Add</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>