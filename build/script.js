var ToDo = React.createClass({displayName: "ToDo",
    getInitialState: function(){
        // Allows us to set a default state for our node
        return {editing: false} // Initially we want the default card 
    },
    componentDidMount: function(){
        // Immediately after our component is rendered - Create draggable items of todo with jQuery UI
        $(this.getDOMNode()).draggable();
    },
    render: function() {
        if(this.state.editing){
            // On clicking edit render the form
            return this.renderEditCard();
        }else{
            // Initially render the default card
            return this.renderDefaultCard();
        }
    },
    renderDefaultCard: function() {
        return (
            React.createElement("div", {className: "todo"}, 
                React.createElement("h3", null, this.props.children), 
                React.createElement("button", {className: "btn btn-primary glyphicon glyphicon-pencil", onClick: this.edit}), 
                React.createElement("button", {className: "btn btn-warning glyphicon glyphicon-trash", onClick: this.delete})
            )
        )
    },
    renderEditCard: function() {
        return (
            React.createElement("div", {className: "todo"}, 
                React.createElement("textarea", {defaultValue: this.props.children, ref: "savedText", className: "form-control"}), 
                React.createElement("button", {className: "btn btn-success btn-sm glyphicon glyphicon-floppy-disk", onClick: this.save})
            )
        )
    },
    edit: function() {
        console.log('Editing task');
        this.setState({editing: true});
    },
    save: function() {
        console.log('Task saved');
        var txt = this.refs.savedText.getDOMNode().value;
        console.log('The saved text is ' + txt);
        this.props.onEdit(this.refs.savedText.getDOMNode().value, this.props.index); // Call onEdit event from TODOList
        this.setState({editing: false});
    },
    delete: function() {
        console.log('Task deleted!');
        this.props.onDelete(this.props.index); // Call onDelete event from TODOList
    }
});

// Create List of TO DO tasks
var ToDoList = React.createClass({displayName: "ToDoList",
    getInitialState: function(){
        return {
            tasks: []
        }
    },
    componentWillMount: function(){
        var self = this;
        if(this.props.count){
            // jQuery getJSON to get JSON from an api
            $.getJSON("http://baconipsum.com/api/?type=all-meat&sentences=" + this.props.count + "&start-with-lorem=1&callback=?", function(results){
                // Callback fn
                results[0].split('. ').forEach(function(sentence){
                    self.addToList(sentence.substring(0, 40));
                })
            });
        }
    },
    addToList: function(newText){
        var tasksArr = this.state.tasks;
        tasksArr.push(newText); // Updating the item at i index
        this.setState({tasks: tasksArr}); // Updating the existing tasks list
    },
    editList: function(newText, i){
        var tasksArr = this.state.tasks;
        tasksArr[i] = newText; // Updating the item at i index
        this.setState({tasks: tasksArr}); // Updating the existing tasks list
    },
    deleteFromList: function(i){
        var tasksArr = this.state.tasks;
        tasksArr.splice(i, 1); // Deleting an item from index i
        this.setState({tasks: tasksArr}); // Updating the existing tasks list
    },
    eachTask: function(task, i){
        // Each tasks moved from render to a new function to keep render function simpler with less code
        return (
            React.createElement(ToDo, {index: i, onEdit: this.editList, onDelete: this.deleteFromList}, task)
        );
    },
    render: function() {
        return (
            React.createElement("div", {className: "todo-list"}, 
                this.state.tasks.map(this.eachTask), 
                React.createElement("button", {className: "btn btn-sm btn-success glyphicon glyphicon-plus", onClick: this.addToList.bind(null, "New Task")})
            )
        ) /* The bind event is to pass default placeholder for the first time we add a task */
    }
});

React.render(React.createElement(ToDoList, {count: 10}), document.getElementById('react-component'));