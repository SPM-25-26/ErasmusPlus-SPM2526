/// --------------------------------------------------
/// Application: Eppoi
/// Project: eppoi-engine
/// File name: GeminiHelper.cs
/// File Description: The Gemini helper service for interacting with Google's Gemini APIs
/// --------------------------------------------------

namespace Eppoi.API
{
    #region Using directives

    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using System;
    using System.Net.Http;
    using System.Text;
    using System.Text.Json;
    using System.Text.Json.Serialization;
    using System.Threading.Tasks;
    using System.Collections.Generic;
    using System.Linq;

    #endregion Using directives

    /// <summary>
    /// The Gemini helper service for interacting with Google's Gemini APIs
    /// </summary>
    public class GeminiHelper
    {
        #region Attributes

        /// <summary>
        /// The typed Gemini settings configuration.
        /// </summary>
        private readonly GeminiEnvSettings _geminiSettings;

        /// <summary>
        /// The HTTP client for making API requests.
        /// </summary>
        private readonly HttpClient _httpClient;

        /// <summary>
        /// JSON serializer options for API requests/responses.
        /// </summary>
        private readonly JsonSerializerOptions _jsonOptions;

        /// <summary>
        /// The logger instance.
        /// </summary>
        private readonly ILogger<GeminiHelper>? _logger;

        #endregion Attributes

        #region Constructor

        /// <summary>
        /// Initialize a new instance of <see cref="GeminiHelper"/> helper service
        /// </summary>
        /// <param name="geminiOptions">The injected Gemini options loaded from environment/settings.</param>
        /// <param name="httpClientFactory">The HTTP client factory for creating HTTP clients.</param>
        /// <param name="logger">Optional logger instance.</param>
        /// <exception cref="ArgumentException">Thrown if the API key is missing.</exception>
        public GeminiHelper(IOptions<GeminiEnvSettings> geminiOptions, IHttpClientFactory httpClientFactory, ILogger<GeminiHelper>? logger = null)
        {
            this._geminiSettings = geminiOptions.Value;

            if (string.IsNullOrWhiteSpace(this._geminiSettings.ApiKey))
            {
                throw new ArgumentException("Gemini API Key is missing in configuration/environment.", nameof(geminiOptions));
            }

            this._httpClient = httpClientFactory.CreateClient();
            this._jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
            };
            this._logger = logger;
        }

        #endregion Constructor

        #region Public methods

        /// <summary>
        /// Generates an embedding for the provided text using Gemini's embedding model.
        /// </summary>
        /// <param name="text">The text string to embed.</param>
        /// <param name="taskType">The task type for embedding (e.g., "SEMANTIC_SIMILARITY", "RETRIEVAL_QUERY", "RETRIEVAL_DOCUMENT").</param>
        /// <param name="outputDimensionality">Optional output dimensionality for the embedding. If not specified, uses the model's default.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the embedding response.</returns>
        /// <exception cref="ArgumentException">Thrown when text is null or empty.</exception>
        /// <exception cref="HttpRequestException">Thrown when the API request fails.</exception>
        public async Task<GeminiEmbeddingResponse> GenerateEmbeddingAsync(string text, string taskType = "SEMANTIC_SIMILARITY", int? outputDimensionality = null)
        {
            if (string.IsNullOrWhiteSpace(text)) throw new ArgumentException("Text cannot be empty.", nameof(text));

            var url = $"{_geminiSettings.BaseUrl}/models/{_geminiSettings.EmbeddingModel}:embedContent";

            var requestPayload = new GeminiEmbeddingRequest
            {
                Content = new GeminiContent { Parts = new List<GeminiTextPart> { new GeminiTextPart { Text = text } } },
                TaskType = taskType,
                OutputDimensionality = outputDimensionality
            };

            return await SendRequestAsync<GeminiEmbeddingRequest, GeminiEmbeddingResponse>(url, requestPayload);
        }

        /// <summary>
        /// Generates embeddings for multiple text parts in a single batch request using Gemini's batch embedding API.
        /// </summary>
        /// <param name="textParts">The list of text strings to embed.</param>
        /// <param name="taskType">The task type for embedding (e.g., "SEMANTIC_SIMILARITY", "RETRIEVAL_QUERY", "RETRIEVAL_DOCUMENT"). Applied to all items.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the batch embedding response.</returns>
        /// <exception cref="ArgumentException">Thrown when textParts is null or empty.</exception>
        /// <exception cref="HttpRequestException">Thrown when the API request fails.</exception>
        public async Task<GeminiBatchEmbeddingResponse> GenerateBatchEmbeddingsAsync(List<string> textParts, string taskType = "RETRIEVAL_DOCUMENT")
		{
			if (textParts == null || textParts.Count == 0) 
				throw new ArgumentException("Text parts cannot be empty.", nameof(textParts));

			var url = $"{this._geminiSettings.BaseUrl}/models/{this._geminiSettings.EmbeddingModel}:batchEmbedContents";
			var modelPath = $"models/{this._geminiSettings.EmbeddingModel}";

			// Build the request using anonymous objects to enforce the correct JSON structure
			var requestPayload = new
			{
				requests = textParts.Select(text => new
				{
					model = modelPath,
					taskType = taskType,
					content = new
					{
						parts = new[] { new { text = text } }
					},
					output_dimensionality = 768
				}).ToList()
			};

			var jsonContent = JsonSerializer.Serialize(requestPayload, this._jsonOptions);
			var httpContent = new StringContent(jsonContent, Encoding.UTF8, "application/json");

			using var request = new HttpRequestMessage(HttpMethod.Post, url);
			request.Content = httpContent;
			request.Headers.Add("x-goog-api-key", this._geminiSettings.ApiKey);

			var response = await this._httpClient.SendAsync(request);
			
			if (!response.IsSuccessStatusCode)
			{
				var error = await response.Content.ReadAsStringAsync();
				throw new HttpRequestException($"Gemini API Error: {response.StatusCode} - {error}");
			}

			var responseContent = await response.Content.ReadAsStringAsync();
			
			// Temporary debug: uncomment the line below to see the actual JSON in console if it still fails
			// Console.WriteLine($"RAW RESPONSE: {responseContent}");

			var batchEmbeddingResponse = JsonSerializer.Deserialize<GeminiBatchEmbeddingResponse>(responseContent, this._jsonOptions);

			if (batchEmbeddingResponse == null)
			{
				throw new InvalidOperationException("Failed to deserialize Gemini batch embedding response.");
			}

			return batchEmbeddingResponse;
		}

        /// <summary>
        /// Sends a generic HTTP POST request to the specified URL with the provided payload and deserializes the response.
        /// </summary>
        /// <typeparam name="TRequest">The type of the request payload.</typeparam>
        /// <typeparam name="TResponse">The type of the response to deserialize.</typeparam>
        /// <param name="url">The URL to send the request to.</param>
        /// <param name="payload">The request payload to serialize and send.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the deserialized response.</returns>
        /// <exception cref="HttpRequestException">Thrown when the API request fails.</exception>
        /// <exception cref="InvalidOperationException">Thrown when the response cannot be deserialized.</exception>
        private async Task<TResponse> SendRequestAsync<TRequest, TResponse>(string url, TRequest payload)
        {
            var jsonContent = JsonSerializer.Serialize(payload, _jsonOptions);
            using var request = new HttpRequestMessage(HttpMethod.Post, url);
            request.Content = new StringContent(jsonContent, Encoding.UTF8, "application/json");
            request.Headers.Add("x-goog-api-key", _geminiSettings.ApiKey);

            var response = await _httpClient.SendAsync(request);
            // This helps you see the actual error if Google responds with 400/500
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new HttpRequestException($"Gemini API Error: {response.StatusCode} - {errorContent}");
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<TResponse>(responseContent, _jsonOptions);
            
            if (result == null) throw new InvalidOperationException("Failed to deserialize response.");
            return result;
        }

        /// <summary>
        /// Generates content using Gemini's generative model based on the provided prompt.
        /// </summary>
        /// <param name="prompt">The text prompt to generate content from.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the generated content response.</returns>
        /// <exception cref="ArgumentException">Thrown when prompt is null or empty.</exception>
        /// <exception cref="HttpRequestException">Thrown when the API request fails.</exception>
        public async Task<GeminiGenerationResponse> GenerateContentAsync(string prompt)
        {
            if (string.IsNullOrWhiteSpace(prompt))
            {
                throw new ArgumentException("Prompt cannot be null or empty.", nameof(prompt));
            }

            var url = $"{this._geminiSettings.BaseUrl}/models/{this._geminiSettings.GenerationModel}:generateContent";

            // Build the request payload
            var requestPayload = new GeminiGenerationRequest
            {
                Contents = new List<GeminiContent>
                {
                    new GeminiContent
                    {
                        Parts = new List<GeminiTextPart>
                        {
                            new GeminiTextPart { Text = prompt }
                        }
                    }
                }
            };

            var jsonContent = JsonSerializer.Serialize(requestPayload, this._jsonOptions);
            
            // Log URL, request payload, and JSON content
            this._logger?.LogInformation("Gemini GenerateContent - URL: {Url}", url);
            this._logger?.LogDebug("Gemini GenerateContent - Request Payload: {@RequestPayload}", requestPayload);
            this._logger?.LogDebug("Gemini GenerateContent - JSON Content: {JsonContent}", jsonContent);
            
            var httpContent = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            using var request = new HttpRequestMessage(HttpMethod.Post, url);
            request.Content = httpContent;
            request.Headers.Add("x-goog-api-key", this._geminiSettings.ApiKey);

            var response = await this._httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var responseContent = await response.Content.ReadAsStringAsync();
            var generationResponse = JsonSerializer.Deserialize<GeminiGenerationResponse>(responseContent, this._jsonOptions);

            if (generationResponse == null)
            {
                throw new InvalidOperationException("Failed to deserialize Gemini generation response.");
            }

            return generationResponse;
        }

        #endregion Public methods
    }

    #region Request/Response Models

    /// <summary>
    /// Represents a text part in a Gemini request.
    /// </summary>
    public class GeminiTextPart
    {
        /// <summary>
        /// Gets or sets the text content.
        /// </summary>
        [JsonPropertyName("text")]
        public string Text { get; set; } = string.Empty;
    }

    /// <summary>
    /// Represents content in a Gemini request/response.
    /// </summary>
    public class GeminiContent
    {
        /// <summary>
        /// Gets or sets the parts of the content.
        /// </summary>
        [JsonPropertyName("parts")]
        public List<GeminiTextPart> Parts { get; set; } = new List<GeminiTextPart>();

        /// <summary>
        /// Gets or sets the role (optional, used in responses).
        /// </summary>
        [JsonPropertyName("role")]
        public string? Role { get; set; }
    }

    /// <summary>
    /// Represents a request for generating embeddings.
    /// </summary>
    public class GeminiEmbeddingRequest
    {
        /// <summary>
        /// Gets or sets the content to embed.
        /// </summary>
        [JsonPropertyName("content")]
        public GeminiContent Content { get; set; } = new GeminiContent();

        /// <summary>
        /// Gets or sets the task type for embedding.
        /// </summary>
        [JsonPropertyName("taskType")]
        public string TaskType { get; set; } = "SEMANTIC_SIMILARITY";

		[JsonPropertyName("output_dimensionality")]
    	public int? OutputDimensionality { get; set; }	
    }

    /// <summary>
    /// Represents an embedding value in the response.
    /// </summary>
    public class GeminiEmbedding
    {
        /// <summary>
        /// Gets or sets the embedding values.
        /// </summary>
        [JsonPropertyName("values")]
        public List<float> Values { get; set; } = new List<float>();
    }

    /// <summary>
    /// Represents the response from the embedding API.
    /// </summary>
    public class GeminiEmbeddingResponse
    {
        /// <summary>
        /// Gets or sets the embedding result.
        /// </summary>
        [JsonPropertyName("embedding")]
        public GeminiEmbedding Embedding { get; set; } = new GeminiEmbedding();
    }

    /// <summary>
    /// Represents a request for generating content.
    /// </summary>
    public class GeminiGenerationRequest
    {
        /// <summary>
        /// Gets or sets the contents for generation.
        /// </summary>
        [JsonPropertyName("contents")]
        public List<GeminiContent> Contents { get; set; } = new List<GeminiContent>();
    }

    /// <summary>
    /// Represents a candidate response from the generation API.
    /// </summary>
    public class GeminiCandidate
    {
        /// <summary>
        /// Gets or sets the content of the candidate.
        /// </summary>
        [JsonPropertyName("content")]
        public GeminiContent Content { get; set; } = new GeminiContent();

        /// <summary>
        /// Gets or sets the finish reason.
        /// </summary>
        [JsonPropertyName("finishReason")]
        public string? FinishReason { get; set; }

        /// <summary>
        /// Gets or sets the index of the candidate.
        /// </summary>
        [JsonPropertyName("index")]
        public int Index { get; set; }
    }

    /// <summary>
    /// Represents the response from the content generation API.
    /// </summary>
    public class GeminiGenerationResponse
    {
        /// <summary>
        /// Gets or sets the list of candidate responses.
        /// </summary>
        [JsonPropertyName("candidates")]
        public List<GeminiCandidate> Candidates { get; set; } = new List<GeminiCandidate>();

        /// <summary>
        /// Gets or sets the usage metadata (optional).
        /// </summary>
        [JsonPropertyName("usageMetadata")]
        public object? UsageMetadata { get; set; }
    }

    /// <summary>
    /// Represents a single item in a batch embedding request.
    /// </summary>
    public class GeminiBatchEmbeddingItem
    {
        /// <summary>
        /// Gets or sets the model path (e.g., "models/gemini-embedding-001").
        /// </summary>
        [JsonPropertyName("model")]
        public string Model { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the task type for embedding.
        /// </summary>
        [JsonPropertyName("taskType")]
        public string TaskType { get; set; } = "RETRIEVAL_DOCUMENT";

        /// <summary>
        /// Gets or sets the content to embed.
        /// </summary>
        [JsonPropertyName("content")]
        public GeminiContent Content { get; set; } = new GeminiContent();

		[JsonPropertyName("output_dimensionality")]
    	public int? OutputDimensionality { get; set; }
    }

    /// <summary>
    /// Represents a request for batch generating embeddings.
    /// </summary>
    public class GeminiBatchEmbeddingRequest
    {
        /// <summary>
        /// Gets or sets the list of embedding requests.
        /// </summary>
        [JsonPropertyName("requests")]
        public List<GeminiBatchEmbeddingItem> Requests { get; set; } = new List<GeminiBatchEmbeddingItem>();
    }

    /// <summary>
    /// Represents a single embedding result in a batch response.
    /// </summary>
    public class GeminiBatchEmbeddingResult
    {
        /// <summary>
        /// Gets or sets the embedding values.
        /// </summary>
        [JsonPropertyName("values")]
        public List<float> Values { get; set; } = new List<float>();
    }

    /// <summary>
    /// Represents the response from the batch embedding API.
    /// </summary>
    public class GeminiBatchEmbeddingResponse
    {
        /// <summary>
        /// Gets or sets the list of embedding results.
        /// </summary>
        [JsonPropertyName("embeddings")]
        public List<GeminiBatchEmbeddingResult> Embeddings { get; set; } = new List<GeminiBatchEmbeddingResult>();
    }

    #endregion Request/Response Models

    /// <summary>
    /// The Gemini Settings model for .env file
    /// </summary>
    public class GeminiEnvSettings
    {
        #region Attributes

        /// <summary>
        /// Gets or sets the Gemini API key
        /// </summary>
        public string ApiKey { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the base URL for Gemini API
        /// </summary>
        public string BaseUrl { get; set; } = "https://generativelanguage.googleapis.com/v1beta";

        /// <summary>
        /// Gets or sets the embedding model name
        /// </summary>
        public string EmbeddingModel { get; set; } = "gemini-embedding-001";

        /// <summary>
        /// Gets or sets the content generation model name
        /// </summary>
        public string GenerationModel { get; set; } = "gemini-3-flash-preview";

        #endregion Attributes

        #region Constructor

        /// <summary>
        /// Initialize a new instance of <see cref="GeminiEnvSettings"/> model
        /// </summary>
        public GeminiEnvSettings()
        {
        }

        #endregion Constructor
    }
}
