<div class="modal fade" id="surficial_data_modal" tabindex="-1" role="dialog" aria-labelledby="surficialDataModal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl" role="document">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="surficialDataModal">EDIT: Monitoring Logs</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <div id="monitoring_logs_container">
                <form>
                    <input type="hidden" class="form-control" id="moms_id" value="0">
                    <div class="row">
                        <div class="col-5">
                            <div class="form-group">
                                <input type="text" id="moms_id" style="display: none;">
                                <!-- <label for="number_of_members">Date and Time</label>
                                <div class="input-group date" id="moms_dt" data-target-input="nearest">
                                    <input type="text" class="form-control datetimepicker-input" data-target="#moms_dt" id="moms_date_time"/>
                                    <div class="input-group-append" data-target="#moms_dt" data-toggle="datetimepicker">
                                        <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                                    </div>
                                </div> -->
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <div class="form-group">
                                <label for="number_of_members">Type of feature</label>
                                <select class="form-control" id="moms_t_feature">
                                    <option value="Crack">Crack</option>
                                    <option value="Scarp">Scarp</option>
                                    <option value="Seepage">Seepage</option>
                                    <option value="Ponding">Ponding</option>
                                    <option value="Tilted/Split trees">Tilted/Split trees</option>
                                    <option value="Damage structures">Damage structures</option>
                                    <option value="Slope Failure">Slope failure</option>
                                    <option value="Bulding/Depression">Bulding/Depression</option>
                                    <option value="none">None</option>
                                </select>
                            </div>
                        </div>
                        <div class="col">
                        <div class="form-group">
                            <label for="number_of_members">Name of feature</label>
                            <input type="text" class="form-control" id="moms_n_feature">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <div class="form-group">
                                <label for="number_of_members">Description</label>
                                <textarea class="form-control" id="moms_description" style="height : 100px"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="float-right">
                        <button type="button" class="btn btn-primary btn-sm" id="add_monitoring_logs">Add</button>
                        <button type="button" class="btn btn-danger btn-sm" id="cancel_monitoring_logs">Cancel</button>
                    </div>
                    <br>
                    <br>
                </form>
            </div>
        </div>
        <!-- <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
        </div> -->
        </div>
    </div>
</div>

<div class="modal fade" id="addMomsImagesModal" tabindex="-1" role="dialog" aria-labelledby="addMomsImagesModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="addMomsImagesModalLabel">Upload MOMs Images</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <form method="post" id="upload_moms_form" enctype="multipart/form-data">
                <div class="row">
                    <div class="col">
                        <input type="file" id="moms_image" multiple="multiple" />
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <b id="moms_upload_status"></b>
                        <div id="momsUploadPreview"></div>
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <div id="upload_spinner" style="visibility:hidden">
                <button class="btn btn-primary" type="button" disabled>
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Uploading
                </button>
            </div>
            <div id="upload_buttons">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="upload_moms_images">Upload</button>
            </div>
        </div>
        </div>
    </div>
</div>

<div class="modal fade" id="view_moms_modal" tabindex="-1" role="dialog" aria-labelledby="viewMomsModal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl" role="document">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="viewMomsModalLabel">MOMs Images</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <div id="moms_details">

            </div>
            <hr>
            <div id="moms_image_container">
                
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
        </div>
    </div>
</div>

<div class="modal fade" id="raise_moms_modal" tabindex="-1" role="dialog" aria-labelledby="raiseMomsModal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="raiseMomsModalLabel">Raise MOMs</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <input type="text" id="moms_id" style="display: none;">
                <label for="number_of_members">Observance Timestamp</label>
                <div class="input-group date" id="observance_timestamp" data-target-input="nearest">
                    <input type="text" class="form-control datetimepicker-input" data-target="#observance_timestamp" id="observance_ts"/>
                    <div class="input-group-append" data-target="#observance_timestamp" data-toggle="datetimepicker">
                        <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                    </div>
                </div>
            </div>
            <label>Select alert level</label>
            <select id="moms_alert_level" class="form-control">
                <option value="0">Non-significant</option>
                <option value="2">Significant</option>
                <option value="3">Critical</option>
            <select>
            <label>Remarks</label>
            <textarea class="form-control" id="moms_remarks" style="height : 100px"></textarea>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary" id="raise_moms">Raise</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
        </div>
    </div>
</div>

<div class="modal fade" id="isForLoweringModal" tabindex="-1" role="dialog" aria-labelledby="isForLoweringModal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="isForLoweringModalLabel">Raise MOMs</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <input type="text" id="moms_id" style="display: none;">
                <label for="number_of_members">Observance Timestamp</label>
                <div class="input-group date" id="observance_timestamp" data-target-input="nearest">
                    <input type="text" class="form-control datetimepicker-input" data-target="#observance_timestamp" id="observance_ts"/>
                    <div class="input-group-append" data-target="#observance_timestamp" data-toggle="datetimepicker">
                        <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                    </div>
                </div>
            </div>
            <label>Select alert level</label>
            <select id="moms_alert_level" class="form-control">
                <option value="0">Non-significant</option>
                <option value="2">Significant</option>
                <option value="3">Critical</option>
            <select>
            <label>Remarks</label>
            <textarea class="form-control" id="moms_remarks" style="height : 100px"></textarea>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary" id="raise_moms">Raise</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
        </div>
    </div>
</div>

