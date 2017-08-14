# eBayEasyListing

<h2><i>Offline Solutions to High Network Latency</i></h2>

<h3>Introduction</h3>
<p>Depending on a user’s internet connection and network latency, webpages or applications using the internet may take multiple minutes to load at a time. In an environment where internet usage is crucial to a user, slow speeds can be detrimental to both efficiency and productivity. This is especially apparent in situations of business, where it is extremely important to complete tasks in a timely manner.</p>
<br>
<p>running an eBay business is a popular form of self-employment in the United States.  For a regular consumer using eBay, the time it takes to list an item for sale is meaningless. However, when listing massive numbers of items on a daily basis, every second of the process counts toward efficiency.  One chunk of wasted time in the listing process is the multiple periods of webpage loads that occur throughout each individual listing.  Depending on internet quality, these load times could range anywhere between 10 to 30 seconds per listing.  When running an eBay business where the number of listings per day ranges in the hundreds, this amount of time adds up quickly.</p>

<h3>Solution</h3>
<span>EasyListing proposes two solutions:</span>
<ol>
	<li>Eliminate wait time due to page / element loads by:</li>
		<ul>
			<li>Hosting the entire application locally</li>
			<li>Allowing the user to start the next listing while the previous listing submits</li>
		</ul>
	<li>Enhance the listing process by:</li>
		<ul>
			<li>Making a "click-through" form to eliminate time spent typing</li>
			<li>Create a description generator to create a description based on selected product defects</li>
			<li>Use eBay user profiles to more easily select payment, return, and shipping policies</li>
			<li>Upload the files locally rather than straight to eBay to avoid additional wait times, then upload the files once the user submits</li>
		</ul>
</ol>
<br>
<span><b>Note:</b> This application was developed specifically for creating listings for iPods and iPhones ONLY. It is not an application for any generic listing.</span>

<h3>Screenshots</h3>
<h4>Application Start</h4>
<img src="https://github.com/couturmi/eBayEasyListing/blob/master/screenshots/StartPage.PNG" width="650">
<h4>Log In</h4>
<img src="https://github.com/couturmi/eBayEasyListing/blob/master/screenshots/LogIn.PNG" width="450">
<img src="https://github.com/couturmi/eBayEasyListing/blob/master/screenshots/GrantAccess.PNG" width="450">
<h4>Application Ready</h4>
<img src="https://github.com/couturmi/eBayEasyListing/blob/master/screenshots/AppReady.PNG" width="450">
<span>Multiple tabs</span>
<img src="https://github.com/couturmi/eBayEasyListing/blob/master/screenshots/Tabs.PNG" width="450">
<h4>Listing</h4>
<h5>Section 1</h5>
<img src="https://github.com/couturmi/eBayEasyListing/blob/master/screenshots/Listing_Section1_empty.PNG" width="450">
<img src="https://github.com/couturmi/eBayEasyListing/blob/master/screenshots/Listing_Section1_filled.PNG" width="450">
<h5>Select Product</h5>
<span>The user can continue completing the form while this request loads</span>
<img src="https://github.com/couturmi/eBayEasyListing/blob/master/screenshots/Listing_ProcessingRequest.PNG" width="450">
<img src="https://github.com/couturmi/eBayEasyListing/blob/master/screenshots/Listing_CompleteRequest.PNG" width="450">
<span>If one product is found:</span>
<img src="https://github.com/couturmi/eBayEasyListing/blob/master/screenshots/Listing_ProductFound.PNG" width="450">
<span>If multiple products are found:</span>
<img src="https://github.com/couturmi/eBayEasyListing/blob/master/screenshots/Listing_ProductsFound.PNG" width="450">
<span>Once a product is selected:</span>
<img src="https://github.com/couturmi/eBayEasyListing/blob/master/screenshots/Listing_Section1_complete.PNG" width="450">
<h5>Section 2</h5>
<img src="https://github.com/couturmi/eBayEasyListing/blob/master/screenshots/Listing_Section2_empty.PNG" width="450">
<img src="https://github.com/couturmi/eBayEasyListing/blob/master/screenshots/Listing_Section2_filled.PNG" width="450">
<h5>Photos</h5>
<img src="https://github.com/couturmi/eBayEasyListing/blob/master/screenshots/Listing_Photos.PNG" width="450">
<h5>Section 3 & 4</h5>
<img src="https://github.com/couturmi/eBayEasyListing/blob/master/screenshots/Listing_AdditionalSections.PNG" width="450">
<h4>Submission</h4>
<span>Once the user submits a listing, this screen is displayed</span>
<img src="https://github.com/couturmi/eBayEasyListing/blob/master/screenshots/Listing_Loading.PNG" width="450">
<span>On Success</span>
<img src="https://github.com/couturmi/eBayEasyListing/blob/master/screenshots/Listing_Success.PNG" width="450">
<span>On Failure</span>
<img src="https://github.com/couturmi/eBayEasyListing/blob/master/screenshots/Listing_Failed.PNG" width="450">

<h3>How to Run</h3>
<span>Run the <b>easyListing.exe</b> executable</span>

<h3>Updating the Executable</h3>
<span>Run command:</span>
<code>enclose nodeServer.js -o easyListing.exe</code>