import AnnouncementBanner from "./announcement-banner";
import {render} from "@testing-library/react";
import React from "react";


describe('Announcement Banner', () => {
  const mockText = 'Mock Announcement Text';

  it('expects the announcement text to be rendered', () => {
    const { getByText } = render(<AnnouncementBanner>{mockText}</AnnouncementBanner>);
    expect(getByText(mockText)).toBeInTheDocument();
  });

  it('expects the x icon to be rendered', () => {
    const { getByRole } = render(<AnnouncementBanner>{mockText}</AnnouncementBanner>);
    expect(getByRole('button', {tabIndex: '0'})).toBeInTheDocument();
  });

  it('expects the banner to not be visible on click of the x button', () => {
    const { getByRole, getByTestId } = render(<AnnouncementBanner>{mockText}</AnnouncementBanner>);
    const xButton = getByRole('button', {tabIndex: '0'});
    const banner = getByTestId('bannerContainer')

    expect(xButton).toBeInTheDocument();
    expect(banner).toBeInTheDocument();

    xButton.click();

    expect(banner).not.toBeInTheDocument();
  });

  it('expects the background color to be changeable', () => {
    const { getByTestId } = render(
      <AnnouncementBanner altStyle={{backgroundColor: '#888888'}}>
      {mockText}
      </AnnouncementBanner>);
    expect(getByTestId('bannerContainer')).toHaveStyle({backgroundColor: '#888888'});
  });

});
