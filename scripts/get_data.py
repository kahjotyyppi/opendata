import argparse
import logging
import sys
from datetime import datetime, timedelta
import dose_rates
import settings
from fmi_utils import fmi_request_datetime_format
from metadata import update_metadata
from time_series import generate_time_series

def get_program_arguments():
    """
    Parses the program's arguments.

    :return: program arguments
    """
    parser = argparse.ArgumentParser(description="Gets data from FMI's open data API.")
    parser.add_argument("-s", "--timespan", nargs=2, metavar=('FROM', 'TO'),
                        help="define a timespan for which to get data, datetime format {}".format(fmi_request_datetime_format))
    parser.add_argument("-q", "--quiet", action="store_true", help="suppress console output")
    return parser.parse_args()

def initialize_logging(args):
    """
    Initializes logging facilities.

    :param args: program arguments
    """
    if args.quiet:
        logger = logging.getLogger()
        logger.disabled = True
    else:
        logging.basicConfig(level=logging.DEBUG, format="%(levelname)s:%(message)s")

def get_data(args):
    """
    Gets data based on the arguments provided to the program.

    :param args: program arguments
    """
    dose_rates.get_data(args)
    update_metadata()
    generate_time_series(args)

if __name__ == "__main__":
    args = get_program_arguments()
    initialize_logging(args)
    settings.load()
    get_data(args)