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
                                <label for="number_of_members">Date and Time</label>
                                <input class="form-control" type="text" id="moms_dt">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <div class="form-group">
                                <label for="number_of_members">Type of feature</label>
                                <textarea class="form-control" id="moms_t_feature" style="height : 100px"></textarea>
                            </div>
                        </div>
                        <div class="col">
                        <div class="form-group">
                                <label for="number_of_members">Name of feature</label>
                                <textarea class="form-control" id="moms_n_feature" style="height : 100px"></textarea>
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
            <form id="moms_upload_form" method="post" enctype="multipart/form-data">
                <div class="row">
                    <div class="col">
                        <div class="form-group">
                            <label for="file">Upload image(s)</label>
                            <input type="file" id="image_file" multiple="multiple">
                            <input id="file_to_upload" type="file" name="files[]" class="form-control-file" multiple="true" autocomplete="off" required>
                        </div>
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