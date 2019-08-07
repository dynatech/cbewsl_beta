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
                <img src="http://cbewsl.com/uploads/moms/1/Screenshot_from_2019-07-12_10-44-21.png" alt="..." class="img-thumbnail" height="200px" width="200px">
                <img src="http://cbewsl.com/uploads/moms/1/Screenshot_from_2019-07-15_09-39-51.png" alt="..." class="img-thumbnail" height="200px" width="200px">
                <img src="http://cbewsl.com/uploads/moms/1/Screenshot_from_2019-07-12_10-44-21.png" alt="..." class="img-thumbnail" height="200px" width="200px">
                <img src="http://cbewsl.com/uploads/moms/1/Screenshot_from_2019-07-15_09-39-51.png" alt="..." class="img-thumbnail" height="200px" width="200px">
                <img src="http://cbewsl.com/uploads/moms/1/Screenshot_from_2019-07-12_10-44-21.png" alt="..." class="img-thumbnail" height="200px" width="200px">
                <img src="http://cbewsl.com/uploads/moms/1/Screenshot_from_2019-07-15_09-39-51.png" alt="..." class="img-thumbnail" height="200px" width="200px">
                <img src="http://cbewsl.com/uploads/moms/1/Screenshot_from_2019-07-12_10-44-21.png" alt="..." class="img-thumbnail" height="200px" width="200px">
                <img src="http://cbewsl.com/uploads/moms/1/Screenshot_from_2019-07-15_09-39-51.png" alt="..." class="img-thumbnail" height="200px" width="200px">
                <img src="http://cbewsl.com/uploads/moms/1/Screenshot_from_2019-07-12_10-44-21.png" alt="..." class="img-thumbnail" height="200px" width="200px">
                <img src="http://cbewsl.com/uploads/moms/1/Screenshot_from_2019-07-15_09-39-51.png" alt="..." class="img-thumbnail" height="200px" width="200px">
                <img src="http://cbewsl.com/uploads/moms/1/Screenshot_from_2019-07-12_10-44-21.png" alt="..." class="img-thumbnail" height="200px" width="200px">
                <img src="http://cbewsl.com/uploads/moms/1/Screenshot_from_2019-07-15_09-39-51.png" alt="..." class="img-thumbnail" height="200px" width="200px">
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
        </div>
    </div>
</div>