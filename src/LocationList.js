import React, {Component} from 'react';
import LocationItem from './LocationItem';

class LocationList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locations: '',
            query: '',
            suggestions: false,
        };

        this.filterLocations = this.filterLocations.bind(this);
        this.toggleSuggestions = this.toggleSuggestions.bind(this);
    }

    /**
     * Filter Locations based on user query
     */
    filterLocations(event) {
        this.props.closeInfoWindow();
        const {value} = event.target;
        var locations = [];
        this.props.locationList.forEach(function (location) {
            if (location.name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                location.marker.setVisible(true);
                locations.push(location);
            } else {
                location.marker.setVisible(false);
            }
        });

        this.setState({
            locations: locations,
            query: value
        });
    }

    componentWillMount() {
        this.setState({
            locations: this.props.locationList
        });
    }

    /**
     * Show and hide suggestions
     */
    toggleSuggestions() {
        this.setState({
            locations: this.props.locationList,
            suggestions: !this.state.suggestions
        });
    }

    render() {
        var locationList = this.state.locations.map(function (locationData, index) {
            return (
                <LocationItem key={index} openInfoWindow={this.props.openInfoWindow.bind(this)} data={locationData}/>
            );
        }, this);

        return (
            <div className="search">
                <input role="search" aria-labelledby="filter" id="search-field" className="search-field" type="text" placeholder="Search.."
                       value={this.state.query} onChange={this.filterLocations}/>
                <ul>
                    {this.state.suggestions && locationList}
                </ul>
                <button className="button" onClick={this.toggleSuggestions}>Show/Hide Suggestions</button>
            </div>
        );
    }
}

export default LocationList;