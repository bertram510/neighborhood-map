import React, {Component} from 'react';
import LocationItem from './LocationItem';

class LocationFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locations: '',
            query: ''
        };

        this.filterLocations = this.filterLocations.bind(this);
    }

    /**
     * Filter Locations based on user query
     */
    filterLocations(event) {
        this.props.closeInfoWindow();
        var locations = [];
        this.props.locationList.forEach(function (location) {
            if (location.name.toLowerCase().indexOf(event.target.value.toLowerCase()) >= 0) {
                location.marker.setVisible(true);
                locations.push(location);
            } else {
                location.marker.setVisible(false);
            }
        });

        this.setState({
            locations: locations,
            query: event.target.value
        });
    }

    componentWillMount() {
        this.setState({
            locations: this.props.locationList
        });
    }

    render() {
        return (
            <div className="search">
                <input role="search" aria-labelledby="filter" id="search-field" className="search-field" type="text" placeholder="Search.."
                       value={this.state.query} onChange={this.filterLocations}/>
                <ul>
                    {
                        this.state.locations.map(function (locationData, index) {
                            return (
                                <LocationItem key={index} openInfoWindow={this.props.openInfoWindow.bind(this)} data={locationData}/>
                            );
                        }, this)
                    }
                </ul>
            </div>
        );
    }
}

export default LocationFilter;