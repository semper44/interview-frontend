$(document).ready(function() {
    let createModal =$('#create-modal')
    let updateModal =$('#update-modal')
    let images = ["../images/15_Q0rCeTd.jpg", "../images/768.png", "../images/cover.jpg", "../images/IMG_nMnY6QO.jpg", "../images/R_1.jpg", "../images/wp.jpg"]
    let centralData;
    let globalTr;
    let globalClickedTaskOptions;
    let globalName;
    let secondTbody = $("#search-and-filter-tbody")
    let firstTbody = $('#first-tbody')
    let searchResultsOnly = $('.search-body-only ')
    let p = $("<p>").addClass("font-xl text-red-600 text-center mt-8").text("Nothing found")


    function createANewTableRow(item, element){
        let store = []
        const createdDate = new Date(item.created);
        const expiresDate = new Date(item.expires);

        const differenceMs = Math.abs(expiresDate - createdDate);

        let dateDue = "";
        // Convert milliseconds to days, hours, minutes, and seconds
        const days = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((differenceMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((differenceMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((differenceMs % (1000 * 60)) / 1000);


        if(days > 1){
            dateDue = `${days} days, ${minutes} mins`
        }else if(days < 1 && minutes > 1){
            dateDue = `${minutes} mins`
        }else if(days < 1 && minutes < 1 && seconds > 1){
            dateDue = `${seconds} secs`
        }


        console.log(item.expires - item.created);
        let random = Math.floor(Math.random()* images.length)
        let random2 = Math.floor(Math.random()* images.length)
        
        let tr = $('<tr>').addClass('table-rows shadow-md my-3 rounded-lg');
    
        // Create and append td for the first column
        let td1 = $('<td>').addClass('px-6 py-4 whitespace-nowrap');
        let div1 = $('<div>').addClass('flex items-center gap-3');
        div1.append($('<img>').attr('src', item.image_url).attr('alt', item.name).addClass('first-img fw-[20px] h-[20px] rounded-full'));
        let leftDiv = $('<div>').addClass('left');
        leftDiv.append($('<p>').addClass('table-name text-base font-bold').text(item.name));
        leftDiv.append($('<div>').addClass('date text-gray-400 text-sm').text('Oct 11, 2021'));
        div1.append(leftDiv);
        td1.append(div1);
        tr.append(td1);

        // Creating and append td for the second column
        console.log(dateDue);
        let td2 = $('<td>').addClass('px-6 py-4 md:table-cell whitespace-nowrap');
        td2.append($('<p>').addClass('text-center bg-blue-50 rounded p-2').text(dateDue)).attr('content', item.expires);
        tr.append(td2);

        // Create and append td for the third column
        let td3 = $('<td>').addClass('px-6 py-4  md:table-cell whitespace-nowrap ');
        td3.append($('<p>').addClass('font-bold').text(item.tasks_number +"/"+item.total_tasks));
        td3.append($('<p>').addClass('text-sm text-gray-400').text('Tasks'));
        tr.append(td3);

        // Create and append td for the fourth column
        let progress;
        if(days < 1){
            progress = 100
        }else{
            progress = days
        }
        let td4 = $('<td>').addClass('px-6  md:table-cell whitespace-nowrap');
        td4.append($('<p>').addClass('text-blue-300').text('In Progress'));
        let progressBarDiv = $('<div>').addClass('w-[80%] bg-gray-200 rounded-lg overflow-hidden');
        let progressBarDivSubDiv = $('<div>').attr('id', 'progress-bar').addClass('bg-blue-300 h-2').css("width", `${progress}%`);
        progressBarDiv.append(progressBarDivSubDiv);
        
        td4.append(progressBarDiv);
        tr.append(td4);
        // Create and append td for the fifth column
        let td5 = $('<td>').addClass('px-6 py-4 whitespace-nowrap relative');
        let div2 = $('<div>').addClass('image-parent flex items-center');
        let strings =  item.contributors.split(",")
        div2.append($('<img>').attr('src', images[random]).attr('alt', strings[0]).addClass('first-string w-[20px] h-[20px] rounded-full'));
        div2.append($('<img>').attr('src', images[random2]).attr('alt', strings[1]).addClass('second-string w-[20px] h-[20px] rounded-full'));
        let innerDiv = $('<div>').addClass('w-[20px] h-[20px] rounded-full bg-purple-50 relative flex flex-col justify-center items-center');
        innerDiv.append($('<div>').addClass('flex absolute').append($('<p>').addClass('text-sm text-purple-300').text('+')).append($('<p>').addClass('text-sm text-purple-300').text('3')));
        div2.append(innerDiv);
        div2.append($('<div>').addClass('task-options').append($('<i>').addClass('fa fa-ellipsis-v ml-4 text-gray-500 text-sm cursor-pointer').attr('aria-hidden', 'true')));
        let showOptionsDiv = $('<div>').addClass('show-options').addClass('w-[120px] hidden bg-white px-4 py-3 right-[40px] rounded-lg absolute top-[40px]').css('z-index', '99');
        showOptionsDiv.append($('<div>').addClass('flex gap-3 cursor-pointer mb-4').append($('<p>').addClass('text-gray-500').text('Delete').addClass('delete-task')));
        showOptionsDiv.append($('<div>').addClass('show-update').addClass('flex gap-3 cursor-pointer mb-4').append($('<p>').addClass('text-gray-500').text('Update')));
        showOptionsDiv.append($('<div>').addClass('show-finish').addClass('flex gap-3 cursor-pointer').append($('<p>').addClass('text-gray-500').text('Finish')));
        div2.append(showOptionsDiv);
        td5.append(div2);
        tr.append(td5);

        // Append the created row to the table body i
        console.log(element);
        element.append(tr);
    }

    $('#create-task').on('click',function(){
        createModal.show()
    })
    
   
    $('#show-filter-options').on('click',function(){
        $('#filter-options').toggle()
    })

    $('#button-close').on('click',function(){
        createModal.hide()
    })

    $('#update-button-close').on('click',function(){
        updateModal.hide()
    })

 
    // fecthing request
    $.ajax({
        url: 'https://taskmaster-xs75.onrender.com/tasks/list/',
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            console.log(response);
            centralData = response
            // Iterate over each item in the response
            $.each(response, function(index, item) {
                createANewTableRow(item, firstTbody)
                $("#loading").hide()
            
            });
        },
        error: function(xhr, status, error) {
            console.error('Error fetching data:', error);
        }
    });
    
    

    // submit form
    $('#create-submit').click(function (e) {
        e.preventDefault();
        $('#loading2').show()
        let formData = new FormData();
        formData.append('name', $('#name').val());
        formData.append('contributors', $('#contributors').val());
        formData.append('expires', $('#expires').val());
        formData.append('image', $('#task_id_file')[0].files[0]);
        

        $.ajax({
            url: 'https://taskmaster-xs75.onrender.com/tasks/create/',
            method: 'POST',
            processData: false, 
            contentType: false, 
            data: formData,
            success: function (response) {
                console.log(response);
                createModal.hide();
                createANewTableRow(response, firstTbody);
                $('#loading2').hide()
                Toastify({
                    text: "Task created",
                    duration: 3000,
                    newWindow: true,
                    gravity: "top", 
                    position: "right", 
                    stopOnFocus: true, 
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    },
                }).showToast();

            },
            error: function (xhr, status, error) {
                $('#loading2').hide()
                let errorMessage = xhr.responseJSON.error || "An error occurred.";
                Toastify({
                    text: errorMessage,
                    duration: 3000,
                    newWindow: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    },
                }).showToast();
            }
        });
    });
    

    // to show delete and update options
    $(document).on('click', '.task-options', function() {
        let $showOptionsDiv = $(this).closest('td').find('.show-options');
        $showOptionsDiv.toggle();
    });
    

    // to delete a task
    $(document).on('click', '.delete-task', function() {
        $('#loading2').show()
        let clickedTaskOptions = $(this); 
        let name = clickedTaskOptions.closest('tr').find('.table-name').text();
        let tr = clickedTaskOptions.closest('.table-rows')
        let $showOptionsDiv = $(this).closest('td').find('.show-options');

        $showOptionsDiv.hide()
        
        $.ajax({
            url: `https://taskmaster-xs75.onrender.com/tasks/delete/${name}/`,
            method: 'DELETE',
            dataType: 'json',
            success: function(response) {
                $('#loading2').hide()
                tr.hide()
                Toastify({
                    text: "Deleted successfully",
                    duration: 3000,
                    newWindow: true,
                    gravity: "top", 
                    position: "right", 
                    stopOnFocus: true, 
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    },
                    // onClick: function(){} // Callback after click
                }).showToast();
                
            },
            error: function(xhr, status, error) {
                $('#loading2').hide()
                Toastify({
                    text: error,
                    duration: 3000,
                    newWindow: true,
                    gravity: "top", 
                    position: "right", 
                    stopOnFocus: true, 
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    },
                }).showToast();
            }
            });
    });

    // to show the update modal
    $(document).on('click', ".show-update", function(){
        let clickedTaskOptions = $(this); 
        globalClickedTaskOptions = $(this); 
        let $showOptionsDiv = clickedTaskOptions.closest('td').find('.show-options');
        $showOptionsDiv.hide()
        let name = clickedTaskOptions.closest('tr').find('.table-name').text();
        let closestTr = $(this).closest('.table-rows');
        let associatedImage = closestTr.find('img').attr('src');
        let contentTd = closestTr.find('td[content]');     
        let contentValue = contentTd.attr('content');
        console.log('Custom attribute "content" value:', contentValue);
        let firstString = clickedTaskOptions.closest('td').find('.first-string').attr('alt');
        let secondString = clickedTaskOptions.closest('td').find('.second-string').attr('alt');
        globalTr = $(this).closest('.table-rows');
        
        let form = $('#updatename')
        let contributors = $('#updatecontributors')
        let date = $('#update-expires')
        date.val(contentValue)
        let image = $('#update-modalpreview')
        image.attr("src", associatedImage)
        globalName = name
        form.val(name)
        contributors.val(firstString+","+secondString)
        updateModal.show()
    })

    // updating tasks
    $("#update-submit").on('click', function(e) {  
        console.log($('#update-task_id_file')[0].files[0]);
        $('#loading2').show()
        let name = $('#updatename').val()
        e.preventDefault();  
        let formData = new FormData();
    
        if( $('#updatename').val() !== ""){
            formData.append('name', $('#updatename').val());
        }
        if( $('#updatecontributors').val() !== ""){
            formData.append('contributors', $('#updatecontributors').val());
        }
        if( $('#update-expires').val() !== ""){
            formData.append('expires', $('#update-expires').val());
        }
        if($('#update-task_id_file')[0].files[0]){
            formData.append('image', $('#update-task_id_file')[0].files[0]);
        }
        
        $.ajax({
            url: `https://taskmaster-xs75.onrender.com/tasks/update/${globalName}/`,
            method: 'PATCH',
            data:formData,
            processData: false, 
            contentType: false,
            success: function(response) {
                console.log(response);
                globalTr.find('.first-img').attr('src', response.image)
                let contentTd = globalTr.find('td[content]');     
                contentTd.attr('content', response.expires);
                let strings =  response.contributors.split(",")
                globalClickedTaskOptions.closest('tr').find('.table-name').text(response.name)
                globalClickedTaskOptions.closest('td').find('.first-string').attr('alt', strings[0]);
                globalClickedTaskOptions.closest('td').find('.second-string').attr('alt', strings[1]);
                updateModal.hide()
                $('#loading2').hide()
                Toastify({
                    text: "Update successfull",
                    duration: 3000,
                    newWindow: true,
                    gravity: "top", 
                    position: "right", 
                    stopOnFocus: true, 
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    },
                    }).showToast();
            },
            error: function(xhr, status, error) {
                $('#loading2').hide()
                Toastify({
                    text: error,
                    duration: 3000,
                    newWindow: true,
                    gravity: "top", 
                    position: "right", 
                    stopOnFocus: true, 
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    },
                    // onClick: function(){} // Callback after click
                    }).showToast();
            }
            });
    });
    
     // filtering by status
     $('#filter-options').on('click', 'p', function() {
        const clickedValue = $(this).text();
        firstTbody.hide()
        searchResultsOnly.hide()
        secondTbody.html("")

        
        let flag = false
        for(data of centralData){
            console.log(centralData);
            console.log(data.status);
            console.log(clickedValue === data.status);
            if(data.status ===clickedValue ){
                flag = true
                createANewTableRow(data, secondTbody)
                console.log("ran");
            }
        }
        if(flag === false){
            firstTbody.hide()
            secondTbody.hide()
            searchResultsOnly.empty()
            searchResultsOnly.css("display", "flex")
            searchResultsOnly.append(p)

            
        }else{
            flag && secondTbody.show()
        }
    })

    // hiding search and filter results
    $('#back').on('click',function(){
        secondTbody.hide()
        searchResultsOnly.hide()
        firstTbody.show()
    })


    let baseTypingTimer;
    // Function to perform the AJAX request
    function search(query) {
        const url = 'https://taskmaster-xs75.onrender.com/tasks/search/?q=' + query;

        // Clear previous timeouts
        clearTimeout(baseTypingTimer);

        // Setting a new timeout
        baseTypingTimer = setTimeout(function() {
            firstTbody.hide()
            secondTbody.hide()
            searchResultsOnly.empty()
            searchResultsOnly.css("display", "flex")
            // searchResultsOnly.show()
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    secondTbody.empty(); 
                    secondTbody.show(); 
                    $('#result-number').text(data.length)
                    console.log(data);
                    if (data.length >= 1) {
                        $.each(data, function(index, item) {
                           createANewTableRow(item, secondTbody)
                        });
                    }else{
                        searchResultsOnly.append(p)
                    }
                },
                error: function(xhr, textStatus, errorThrown) {
                    p.html(errorThrown)
                    searchResultsOnly.append(p)
                    console.error('Request failed:', textStatus, errorThrown);
                }
            });
        }, 500);
    }

    $("#input-search").on('input', function() {
        const query = $(this).val().trim(); 
        search(query); 
    });

    const taskCreateparentmodalpreview = $("#parentmodalpreview")
    const updateCreateparentmodalpreview = $("#update-parentmodalpreview")

    const updateTaskfileinputcontainer = $(".update-task-file-input-container")
    const taskfileinputcontainer= $(".task-file-input-container")

    const taskCreatemodalpreview = $("#modalpreview")
    const updatemodalpreview = $("#update-modalpreview")

    // preview buttons
    const uploadsubmitButton = $("#uploadsubmitButton")
    const uploadCancelButton = $("#uploadcancelButton")
    const generalpreview = $("#uploadPreview")
    const uploadpreviewImage = $("#uploadPreviewImage")


    const modalpreviewCancel = $("#task-preview-cancel")
    const updateModalpreviewCancel = $("#update-task-preview-cancel")
    // const taskUploadImage = $("#task_id_file")
    // const updateTaskUploadImage = $("#update-task_id_file")

    function previewFn(e, parentModal, uploadpreviewImage, modalpreviewCancel, uploadPreview, uploadCancelButton, uploadsubmitButton, modalpreview, taskfileinputcontainer, parentmodalpreview){
        const reader = new FileReader();
        let selectedFile = e.target.files[0];
        // console.log($(this))
        // console.log($(this)[0])
        // console.log($(this).closest('body').find('#create-modal'));
        // console.log($(this).closest('#task_id_file').closest("#create-modal")[0]);
    
        if (selectedFile) {
            reader.onload = function (e) {
                $(uploadpreviewImage).attr('src', e.target.result);
                $(uploadPreview).css('display', 'block');
                $(parentModal).css('display', 'none');
            };
            reader.readAsDataURL(selectedFile);
        }
    
        $(uploadCancelButton).click(function (e) {
            $(uploadpreviewImage).val("");
            $(uploadPreview).css('display', 'none');
            $(parentModal).css('display', 'block');

        });
    
        $(modalpreviewCancel).click(function (e) {
            $(modalpreview).val("");
            $(parentmodalpreview).css('display', 'none');
            $(taskfileinputcontainer).css('display', 'block');
        });
    
        $(uploadsubmitButton).click(function (e) {
            $(uploadPreview).css('display', 'none');
            $(parentModal).css('display', 'block');
            $(modalpreview).css('display', 'block');
            const selectedFileUrl = URL.createObjectURL(selectedFile);
            $(taskfileinputcontainer).css({'display':'flex', "align-items":"center"});
            $(taskfileinputcontainer).css('justify-content', 'center');
            $(taskfileinputcontainer).css('gap', '1rem');
            $(parentmodalpreview).css({'display':'flex', "align-items":"center"});
            $(modalpreview).attr('src', selectedFileUrl);
        });
    }
    
    $("#task_id_file").on("change", (e)=>{
        previewFn(e, createModal, uploadpreviewImage, modalpreviewCancel, generalpreview, uploadCancelButton, uploadsubmitButton, taskCreatemodalpreview, taskfileinputcontainer, taskCreateparentmodalpreview)    
    })

    $("#update-task_id_file").on("change", (e)=>{
        previewFn(e, updateModal, uploadpreviewImage, updateModalpreviewCancel, generalpreview, uploadCancelButton, uploadsubmitButton, updatemodalpreview, updateTaskfileinputcontainer, updateCreateparentmodalpreview)    
    })


    $(document).on('click', ".show-finish", function(){
        let name = $(this).closest('tr').find('.table-name').text();
        console.log( $(this).closest('tr'));
        let $showOptionsDiv = $(this).closest('td').find('.show-options');
        $showOptionsDiv.hide()
        
        $.ajax({
            url: `https://taskmaster-xs75.onrender.com/tasks/finish-tasks/${name}/`,
            method: 'PATCH',
            dataType: 'json',
            success: function(response) {
                Toastify({
                    text: "Task marked as finished",
                    duration: 3000,
                    newWindow: true,
                    gravity: "top", 
                    position: "right", 
                    stopOnFocus: true, 
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    },
                    // onClick: function(){} // Callback after click
                }).showToast();
                window.location.reload()
            },
            error: function(xhr, status, error) {
                let errorMessage = xhr.responseJSON.error || "An error occurred.";
                Toastify({
                    text: errorMessage,
                    duration: 3000,
                    newWindow: true,
                    gravity: "top", 
                    position: "right", 
                    stopOnFocus: true, 
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    },
                }).showToast();
            }
            });
    })

});





